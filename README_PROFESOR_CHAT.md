# Instrucciones para probar el chat

Este proyecto incluye una funcionalidad de buzón/chat entre sponsors y creadores.

## Qué se ha implementado

- El sponsor puede abrir una conversación desde Sponsor Discover.
- La conversación empieza en estado pendiente.
- El creator tiene que aceptar la conexión desde Creator Inbox.
- Una vez aceptada, ambas partes pueden enviar mensajes.
- Los mensajes funcionan en tiempo real mediante WebSockets.
- Los mensajes quedan guardados en PostgreSQL.
- Cualquiera de las partes puede cerrar la comunicación.

## Instalación

```bash
npm install
```

## Ejecutar el proyecto

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## Base de datos

El archivo `.env.local` está incluido para la corrección.

Si la base de datos ya está creada y sembrada, solo hace falta ejecutar:

```bash
npm run dev
```

Si hiciera falta recrear tablas o cargar datos demo:

```bash
npx drizzle-kit push --force
npm run db:seed
```

## Usuarios demo

Sponsor:

```text
sponsor1@seed.example.com
```

Creator Aurora Live Lab:

```text
creator1@seed.example.com
```

Creator Data Talks Seville:

```text
creator20@seed.example.com
```

Contraseña demo aceptada:

```text
SeedPass123!
```

También se acepta `Seed123!` para facilitar la demo local.

## Flujo de prueba

1. Entrar como creator en `http://localhost:3000/creator/login`.
2. Crear o editar un evento desde `Creator > Events`.
3. Cerrar sesión con `Sign Out`.
4. Entrar como sponsor en `http://localhost:3000/sponsor/login`.
5. Ir a `Sponsor > Discover`.
6. Abrir el perfil del creator y pulsar `Open chat`.
7. Abrir el creator en otro navegador o ventana de incógnito y entrar con su cuenta.
8. Ir a `Creator > Inbox` y aceptar la conexión.
9. Enviar mensajes desde sponsor y creator.
10. Recargar la página para comprobar que los mensajes persisten.
11. Cerrar la comunicación desde cualquiera de las dos partes.

Nota: para probar sponsor y creator a la vez, abrirlos en navegadores distintos o usar una ventana normal y otra de incógnito. Si se usan dos pestañas normales del mismo navegador, compartirán sesión.
