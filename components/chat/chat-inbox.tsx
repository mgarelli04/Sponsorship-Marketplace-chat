import { redirect } from "next/navigation";
import {
  getChatThreadForUser,
  listChatThreads,
  type ChatRole,
} from "@/src/chat/repository";
import { getCurrentChatUser } from "@/src/chat/session";

function formatDate(value: unknown) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value as string | Date));
}

function statusLabel(status: string) {
  if (status === "pending") return "Pendiente";
  if (status === "accepted") return "Aceptada";
  if (status === "closed") return "Cerrada";
  return status;
}

export default async function ChatInbox({
  role,
  selectedThreadId,
}: {
  role: ChatRole;
  selectedThreadId?: string | null;
}) {
  const user = await getCurrentChatUser().catch(() => null);

  if (!user) {
    redirect(role === "creator" ? "/creator/login" : "/sponsor/login");
  }

  if (user.role !== role) {
    redirect("/");
  }

  const threads = await listChatThreads(user);
  const basePath = role === "creator" ? "/creator/inbox" : "/sponsor/inbox";

  const selectedId =
    selectedThreadId && threads.some((thread) => thread.id === selectedThreadId)
      ? selectedThreadId
      : threads[0]?.id ?? null;

  const selectedThread = selectedId
    ? await getChatThreadForUser(selectedId, user).catch(() => null)
    : null;

  const initialThreadsSignature = threads
    .map((thread) =>
      [
        thread.id,
        thread.status,
        thread.lastMessageAt ? new Date(thread.lastMessageAt).toISOString() : "",
        thread.lastMessage?.body ?? "",
        thread.lastMessage?.senderUserId ?? "",
        thread.lastMessage?.createdAt ? new Date(thread.lastMessage.createdAt).toISOString() : "",
      ].join(":"),
    )
    .join("|");


  const inboxPollingScript = `
(function () {
  var initialSignature = ${JSON.stringify("__INITIAL_SIGNATURE__")};
  initialSignature = initialSignature.replace("__INITIAL_SIGNATURE__", ${JSON.stringify("__SIGNATURE_VALUE__")});

  async function checkInboxChanges() {
    try {
      var response = await fetch("/api/demo-chat-threads", {
        credentials: "same-origin",
        cache: "no-store"
      });

      var payload = await response.json();

      if (!payload.ok) return;

      if (payload.signature !== initialSignature) {
        window.location.reload();
      }
    } catch {}
  }

  setInterval(checkInboxChanges, 2000);
})();
  `;

  const wsScript =
    selectedThread?.status === "accepted"
      ? `
(function () {
  var threadId = ${JSON.stringify(selectedThread.id)};
  var userId = ${JSON.stringify(user.id)};
  var statusEl = document.getElementById("ws-status");
  var form = document.getElementById("chat-message-form");
  var input = document.getElementById("chat-message-body");
  var list = document.getElementById("chat-messages-list");
  if (!form || !input || !list) return;

  var protocol = window.location.protocol === "https:" ? "wss" : "ws";
  var socket = new WebSocket(protocol + "://" + window.location.host + "/api/chat/socket");
  var isOpen = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function appendMessage(message) {
    if (document.querySelector('[data-message-id="' + message.id + '"]')) return;

    var mine = message.senderUserId === userId;
    var wrapper = document.createElement("div");
    wrapper.setAttribute("data-message-id", message.id);
    wrapper.className = "mb-3 flex " + (mine ? "justify-end" : "justify-start");

    var bubble = document.createElement("div");
    bubble.className = "max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm " + (mine ? "bg-[#f79009] text-white" : "bg-white text-[#0f172a] border border-[#d9e2ef]");
    bubble.innerHTML =
      '<p class="mb-1 text-[11px] font-semibold opacity-70">' +
      escapeHtml(message.senderName || "") +
      '</p><p>' +
      escapeHtml(message.body || "") +
      '</p>';

    wrapper.appendChild(bubble);
    list.appendChild(wrapper);
    list.scrollTop = list.scrollHeight;
  }

  socket.addEventListener("open", function () {
    isOpen = true;
    setStatus("WebSocket conectado");
    socket.send(JSON.stringify({ type: "subscribe", threadId: threadId }));
  });

  socket.addEventListener("close", function () {
    isOpen = false;
    setStatus("WebSocket desconectado");
  });

  socket.addEventListener("error", function () {
    isOpen = false;
    setStatus("Error de WebSocket");
  });

  socket.addEventListener("message", function (event) {
    try {
      var payload = JSON.parse(event.data);
      if (payload.type === "message" && payload.threadId === threadId) {
        appendMessage(payload.message);
      }
    } catch {}
  });

  async function sendWithFetch(body) {
    var formData = new FormData();
    formData.append("threadId", threadId);
    formData.append("body", body);

    var response = await fetch("/api/demo-chat-message-json", {
      method: "POST",
      body: formData,
      credentials: "same-origin"
    });

    var payload = await response.json();
    if (payload.ok && payload.message) {
      appendMessage(payload.message);
    }
  }

  async function pollMessages() {
    try {
      var response = await fetch("/api/demo-chat-thread?threadId=" + encodeURIComponent(threadId), {
        credentials: "same-origin",
        cache: "no-store"
      });

      var payload = await response.json();
      if (!payload.ok || !payload.thread || !Array.isArray(payload.thread.messages)) return;

      if (payload.thread.status && payload.thread.status !== "accepted") {
        window.location.reload();
        return;
      }

      payload.thread.messages.forEach(function (message) {
        appendMessage(message);
      });
    } catch {}
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    var body = input.value.trim();
    if (!body) return;

    input.value = "";

    if (isOpen && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "message", threadId: threadId, body: body }));
    } else {
      await sendWithFetch(body);
    }

    setTimeout(pollMessages, 500);
  });

  setInterval(pollMessages, 1500);
  setTimeout(pollMessages, 500);
})();
`
      : "";

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#0f172a]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f79009]">
            {role === "creator" ? "Creator inbox" : "Sponsor inbox"}
          </p>
          <h1 className="text-3xl font-bold">
            {role === "creator" ? "Buzon de sponsors" : "Buzon de creators"}
          </h1>
          <p className="mt-2 text-sm text-[#64748b]">
            Solicitudes, aceptacion de conexiones, mensajes persistentes y WebSocket.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-[#d9e2ef] bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-bold">Conversaciones</h2>

            {threads.length === 0 ? (
              <p className="rounded-xl bg-[#f8fafc] p-4 text-sm text-[#64748b]">
                Todavia no hay conversaciones.
              </p>
            ) : (
              <div className="space-y-2">
                {threads.map((thread) => (
                  <a
                    key={thread.id}
                    href={`${basePath}?thread=${thread.id}`}
                    className={`block rounded-xl border p-3 text-sm transition ${
                      thread.id === selectedId
                        ? "border-[#f79009] bg-[#fff7ed]"
                        : "border-[#e2e8f0] bg-white hover:border-[#f79009]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{thread.counterpartName}</p>
                      <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[11px] text-[#64748b]">
                        {statusLabel(thread.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#64748b]">
                      {thread.lastMessage?.body ?? "Sin mensajes todavia"}
                    </p>
                    <p className="mt-1 text-[11px] text-[#94a3b8]">
                      {formatDate(thread.lastMessageAt ?? thread.createdAt)}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </aside>

          <section className="rounded-2xl border border-[#d9e2ef] bg-white shadow-sm">
            {!selectedThread ? (
              <div className="p-8 text-sm text-[#64748b]">
                Selecciona una conversacion o abre una desde Sponsor Discover.
              </div>
            ) : (
              <>
                <div className="border-b border-[#e2e8f0] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{selectedThread.counterpartName}</h2>
                      <p className="text-sm text-[#64748b]">
                        Estado: {statusLabel(selectedThread.status)}
                      </p>
                      {selectedThread.status === "accepted" && (
                        <p id="ws-status" className="mt-1 text-xs text-emerald-600">
                          Conectando WebSocket...
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {role === "creator" && selectedThread.status === "pending" && (
                        <form method="post" action="/api/demo-chat-action">
                          <input type="hidden" name="threadId" value={selectedThread.id} />
                          <button
                            name="action"
                            value="accept"
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
                          >
                            Accept connection
                          </button>
                        </form>
                      )}

                      {selectedThread.status !== "closed" && (
                        <form method="post" action="/api/demo-chat-action">
                          <input type="hidden" name="threadId" value={selectedThread.id} />
                          <button
                            name="action"
                            value="close"
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600"
                          >
                            Close communication
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                <div id="chat-messages-list" className="max-h-[460px] overflow-y-auto bg-[#f8fafc] p-5">
                  {selectedThread.messages.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-[#cbd5e1] bg-white p-5 text-center text-sm text-[#64748b]">
                      Todavia no hay mensajes.
                    </p>
                  ) : (
                    selectedThread.messages.map((message) => {
                      const mine = message.senderUserId === user.id;
                      return (
                        <div
                          key={message.id}
                          data-message-id={message.id}
                          className={`mb-3 flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                              mine
                                ? "bg-[#f79009] text-white"
                                : "border border-[#d9e2ef] bg-white text-[#0f172a]"
                            }`}
                          >
                            <p className="mb-1 text-[11px] font-semibold opacity-70">
                              {message.senderName}
                            </p>
                            <p>{message.body}</p>
                            <p className="mt-1 text-[10px] opacity-60">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-[#e2e8f0] p-4">
                  {selectedThread.status === "pending" ? (
                    <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                      La conexion esta pendiente. El creator tiene que aceptarla antes de poder enviar mensajes.
                    </p>
                  ) : selectedThread.status === "closed" ? (
                    <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
                      Esta comunicacion esta cerrada.
                    </p>
                  ) : (
                    <form id="chat-message-form" method="post" action="/api/demo-chat-message" className="flex gap-3">
                      <input type="hidden" name="threadId" value={selectedThread.id} />
                      <input
                        id="chat-message-body"
                        name="body"
                        autoComplete="off"
                        placeholder="Escribe un mensaje..."
                        className="min-w-0 flex-1 rounded-xl border border-[#d9e2ef] px-4 py-3 text-sm outline-none focus:border-[#f79009]"
                      />
                      <button className="rounded-xl bg-[#f79009] px-5 py-3 text-sm font-bold text-white">
                        Send
                      </button>
                    </form>
                  )}
                </div>

                <script dangerouslySetInnerHTML={{ __html: inboxPollingScript }} />
                {wsScript && <script dangerouslySetInnerHTML={{ __html: wsScript }} />}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
