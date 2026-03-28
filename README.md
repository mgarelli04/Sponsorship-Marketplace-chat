# Sponsorship Marketplace

Proyecto base en Next.js con:

- Drizzle ORM para acceso a base de datos.
- Supabase Postgres como base de datos.
- Swagger/OpenAPI centralizado en clases dentro de la carpeta `swagger`.

## 1. Requisitos

- Node.js 20+
- npm
- Un proyecto de Supabase con su URL de conexión Postgres (pooler recomendado)

## 2. Variables de entorno

Configura los valores en `.env.local`:

`DATABASE_URL` se usa en Drizzle y debe apuntar a Supabase.

## 3. Cómo lanzar el proyecto

Instalar dependencias:

```bash
npm install
```

Desarrollo:

```bash
npm run dev
```

App local:

- http://localhost:3000

## 4. Drizzle (schema y migraciones)

Archivo de schema:

- `src/db/schema.ts`

Donde se definen las tablas.

Flujo para aplicar en la base de datos los cambios del schema:

```bash
npm run db:generate
npm run db:migrate
```

Comandos disponibles:

- `npm run db:generate`: genera archivos de migración desde el schema.
- `npm run db:migrate`: ejecuta migraciones pendientes.
- `npm run db:studio`: abre Drizzle Studio.
- `npm run db:seed`: ejecuta seed (actualmente vacío).

## 5. Swagger (OpenAPI)

La documentacion Swagger se define por clases y no dentro de los endpoints.

Carpeta principal:

- `swagger/`

Estructura recomendada actual:

- `swagger/spec.ts`: construye la especificacion OpenAPI.
- `swagger/ui.ts`: genera el HTML de Swagger UI.
- `swagger/apis/swagger-api.definition.ts`: contrato base para documentar una API.
- `swagger/apis/<api>.api.swagger.ts`: clase por API con sus operaciones documentadas.
- `swagger/apis/index.ts`: registro central de clases de documentacion.

Endpoints de documentacion:

- JSON OpenAPI: `/api/docs`
- Swagger UI: `/api/docs-ui`

Comando para lanzarlo (levanta toda la app y Swagger):

```bash
npm run dev
```

Ruta donde funciona Swagger UI:

- `http://localhost:3000/api/docs-ui`

Ruta del JSON OpenAPI:

- `http://localhost:3000/api/docs`

Para ver docs localmente:

1. Ejecuta `npm run dev`
2. Abre `http://localhost:3000/api/docs-ui`

### Patron por clase para documentar una API

Cada API define su documentacion en una clase propia (ejemplo de estructura):

- `swagger/apis/payments.api.swagger.ts`

La clase implementa el contrato base y expone sus `paths` (y tags opcionales).
Luego se registra en `swagger/apis/index.ts`.
