import crypto from "node:crypto";
import http from "node:http";
import type { Socket } from "node:net";
import next from "next";
import { getToken, type JWT } from "next-auth/jwt";
import { addChatMessage, getAuthorizedThread, type ChatRole, type ChatUser } from "./src/chat/repository";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

type RealtimeClient = {
  socket: Socket;
  user: ChatUser;
  threadIds: Set<string>;
};

const clientsByThread = new Map<string, Set<RealtimeClient>>();

function websocketAcceptKey(key: string) {
  return crypto.createHash("sha1").update(`${key}${WS_GUID}`).digest("base64");
}

function encodeFrame(payload: unknown) {
  const data = Buffer.from(JSON.stringify(payload));
  const length = data.length;

  if (length < 126) {
    return Buffer.concat([Buffer.from([0x81, length]), data]);
  }

  if (length < 65536) {
    const header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(length, 2);
    return Buffer.concat([header, data]);
  }

  const header = Buffer.alloc(10);
  header[0] = 0x81;
  header[1] = 127;
  header.writeBigUInt64BE(BigInt(length), 2);
  return Buffer.concat([header, data]);
}

function decodeFrame(buffer: Buffer) {
  if (buffer.length < 2) return null;

  const opcode = buffer[0] & 0x0f;
  let offset = 2;
  let length = buffer[1] & 0x7f;
  const masked = (buffer[1] & 0x80) === 0x80;

  if (length === 126) {
    if (buffer.length < offset + 2) return null;
    length = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (length === 127) {
    if (buffer.length < offset + 8) return null;
    length = Number(buffer.readBigUInt64BE(offset));
    offset += 8;
  }

  if (!masked) return null;
  if (buffer.length < offset + 4 + length) return null;

  const mask = buffer.subarray(offset, offset + 4);
  offset += 4;
  const payload = Buffer.from(buffer.subarray(offset, offset + length));

  for (let i = 0; i < payload.length; i += 1) {
    payload[i] ^= mask[i % 4];
  }

  return { opcode, text: payload.toString("utf8") };
}

function send(client: RealtimeClient, payload: unknown) {
  if (!client.socket.destroyed) {
    client.socket.write(encodeFrame(payload));
  }
}

function broadcast(threadId: string, payload: unknown) {
  const clients = clientsByThread.get(threadId);
  if (!clients) return;

  for (const client of clients) {
    send(client, payload);
  }
}

function unsubscribeAll(client: RealtimeClient) {
  for (const threadId of client.threadIds) {
    const set = clientsByThread.get(threadId);
    set?.delete(client);
    if (set?.size === 0) {
      clientsByThread.delete(threadId);
    }
  }
  client.threadIds.clear();
}

function subscribeClient(client: RealtimeClient, threadId: string) {
  let clients = clientsByThread.get(threadId);
  if (!clients) {
    clients = new Set<RealtimeClient>();
    clientsByThread.set(threadId, clients);
  }

  clients.add(client);
  client.threadIds.add(threadId);
}

function readCookie(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const cookie = cookies.find((part) => part.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

function toDemoChatUser(cookieHeader: string | undefined): ChatUser | null {
  const id = readCookie(cookieHeader, "demo-user-id");
  const role = readCookie(cookieHeader, "demo-role");

  if (!id || (role !== "creator" && role !== "sponsor")) {
    return null;
  }

  return {
    id,
    role: role as ChatRole,
    email: null,
    name: role === "creator" ? "Creator demo" : "Sponsor demo",
  };
}

function toChatUser(token: JWT | null): ChatUser | null {
  const role = token?.role;
  const id = token?.id;

  if (typeof id !== "string" || (role !== "creator" && role !== "sponsor")) {
    return null;
  }

  return {
    id,
    role: role as ChatRole,
    email: typeof token?.email === "string" ? token.email : null,
    name: typeof token?.name === "string" ? token.name : null,
  };
}

async function handleChatPayload(client: RealtimeClient, rawPayload: string) {
  try {
    const payload = JSON.parse(rawPayload) as {
      type?: string;
      threadId?: string;
      body?: string;
    };

    if (payload.type === "ping") {
      send(client, { type: "pong" });
      return;
    }

    if (!payload.threadId) {
      send(client, { type: "error", message: "Falta el identificador de la conversacion." });
      return;
    }

    if (payload.type === "subscribe") {
      await getAuthorizedThread(payload.threadId, client.user);
      subscribeClient(client, payload.threadId);
      send(client, { type: "subscribed", threadId: payload.threadId });
      return;
    }

    if (payload.type === "message") {
      const message = await addChatMessage(payload.threadId, client.user, payload.body ?? "");
      broadcast(payload.threadId, { type: "message", threadId: payload.threadId, message });
      return;
    }

    send(client, { type: "error", message: "Tipo de evento websocket no soportado." });
  } catch (error) {
    send(client, {
      type: "error",
      message: error instanceof Error ? error.message : "No se pudo procesar el websocket.",
    });
  }
}

async function handleUpgrade(request: http.IncomingMessage, socket: Socket) {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  if (url.pathname !== "/api/chat/socket") {
    socket.destroy();
    return;
  }

  const key = request.headers["sec-websocket-key"];
  if (typeof key !== "string") {
    socket.destroy();
    return;
  }

  const token = await getToken({ req: request as unknown as Parameters<typeof getToken>[0]["req"], secret: process.env.NEXTAUTH_SECRET });
  const user = toChatUser(token) ?? toDemoChatUser(request.headers.cookie);
  if (!user) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  socket.write(
    [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${websocketAcceptKey(key)}`,
      "\r\n",
    ].join("\r\n"),
  );

  const client: RealtimeClient = { socket, user, threadIds: new Set() };

  socket.on("data", (chunk) => {
    const frame = decodeFrame(chunk);
    if (!frame) return;

    if (frame.opcode === 0x8) {
      socket.end();
      return;
    }

    if (frame.opcode === 0x1) {
      void handleChatPayload(client, frame.text);
    }
  });

  socket.on("close", () => unsubscribeAll(client));
  socket.on("end", () => unsubscribeAll(client));
  socket.on("error", () => unsubscribeAll(client));
}

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  server.on("upgrade", (request, socket) => {
    const upgradedSocket = socket as Socket;
    handleUpgrade(request, upgradedSocket).catch(() => {
      upgradedSocket.destroy();
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
