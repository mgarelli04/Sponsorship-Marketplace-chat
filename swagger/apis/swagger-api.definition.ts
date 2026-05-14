export interface SwaggerApiDefinition {
  getPaths(): Record<string, unknown>;
  getTags?(): Array<{ name: string; description?: string }>;
}
