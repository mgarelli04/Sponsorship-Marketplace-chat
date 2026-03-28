export interface SwaggerApiDefinition {
  // Devuelve los paths OpenAPI de una API concreta.
  getPaths(): Record<string, unknown>;

  // Devuelve tags opcionales para agrupar endpoints en Swagger UI.
  getTags?(): Array<{ name: string; description?: string }>;
}
