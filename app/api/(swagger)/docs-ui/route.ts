import { getSwaggerUiHtml } from '@/swagger/ui';

export async function GET() {
  return new Response(getSwaggerUiHtml('/api/docs'), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
