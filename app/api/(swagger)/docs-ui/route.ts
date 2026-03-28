import { getSwaggerUiHtml } from '@/swagger/ui';

// Wrapper minimo requerido por Next para exponer Swagger UI.
export async function GET() {
  return new Response(getSwaggerUiHtml('/api/docs'), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
