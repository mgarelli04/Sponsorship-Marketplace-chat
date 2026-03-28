import { swaggerSpec } from '@/swagger/spec';

// Wrapper minimo requerido por Next para exponer el JSON OpenAPI.
export async function GET() {
  return Response.json(swaggerSpec);
}
