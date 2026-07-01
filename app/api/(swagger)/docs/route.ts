import { swaggerSpec } from '@/swagger/spec';

export async function GET() {
  return Response.json(swaggerSpec);
}
