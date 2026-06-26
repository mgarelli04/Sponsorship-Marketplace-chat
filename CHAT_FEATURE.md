# Funcionalidad de buzon / chat

Esta implementacion añade un buzon entre sponsors y creadores de eventos.

## Flujo funcional

1. El sponsor entra en el perfil publico de un creator desde `Sponsor > Discover`.
2. Pulsa `Open chat`.
3. Se crea una conversacion en estado `pending` y el sponsor queda en espera.
4. El creator entra en `Creator > Inbox` y puede aceptar la conexion.
5. Cuando la conexion pasa a `accepted`, ambas partes pueden intercambiar mensajes.
6. Los mensajes se envian por WebSocket y se guardan en PostgreSQL.
7. Si cualquiera pulsa `Cerrar comunicacion`, la conversacion pasa a `closed` y se bloquea el envio de mensajes.

## Rutas añadidas

- `/sponsor/inbox`: buzon del sponsor.
- `/creator/inbox`: buzon del creator.
- `/api/chat/threads`: listar o crear conversaciones.
- `/api/chat/threads/[id]`: leer una conversacion y sus mensajes persistidos.
- `/api/chat/threads/[id]/accept`: aceptar la conexion, solo creator.
- `/api/chat/threads/[id]/close`: cerrar la comunicacion, sponsor o creator.
- `/api/chat/socket`: WebSocket para mensajes en tiempo real.

## Base de datos

Se han añadido dos tablas:

- `chat_connections`: guarda la relacion entre creator y sponsor, su estado (`pending`, `accepted`, `closed`) y fechas importantes.
- `chat_messages`: guarda cada mensaje, su conversacion, emisor, contenido y fecha.

La migracion esta en `src/db/migrations/0001_chat_inbox.sql`.

## Como ejecutarlo

1. Instalar dependencias: `npm install`.
2. Configurar las variables existentes de Supabase/PostgreSQL y NextAuth.
3. Ejecutar migraciones: `npm run db:migrate`.
4. Arrancar el proyecto: `npm run dev`.

El comando `npm run dev` usa ahora `tsx server.ts`, porque el chat necesita un servidor Node propio para atender el upgrade WebSocket y mantener las conexiones activas.

## Puntos para la presentacion oral

- Se ha implementado un flujo de aceptacion: el sponsor puede iniciar la conversacion, pero no puede escribir hasta que el creator acepte.
- El tiempo real se resuelve con WebSockets nativos del navegador y un servidor Node integrado con Next.
- La persistencia se resuelve guardando todos los mensajes en PostgreSQL mediante Drizzle.
- La autorizacion comprueba el rol de NextAuth: solo el sponsor propietario y el creator propietario pueden leer o escribir en una conversacion.
- Cualquier parte puede cerrar la comunicacion; cuando esta cerrada, el input de mensajes queda bloqueado.
