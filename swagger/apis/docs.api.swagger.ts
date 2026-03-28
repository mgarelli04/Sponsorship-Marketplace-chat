import { SwaggerApiDefinition } from './swagger-api.definition';

export class DocsApiSwagger implements SwaggerApiDefinition {
  // Documenta el endpoint que expone el JSON OpenAPI.
  getPaths(): Record<string, unknown> {
    return {
      '/api/docs': {
        get: {
          tags: ['Documentacion'],
          summary: 'Obtener especificacion OpenAPI en JSON',
          responses: {
            200: {
              description: 'Especificacion OpenAPI',
            },
          },
        },
      },
      '/api/docs-ui': {
        get: {
          tags: ['Documentacion'],
          summary: 'Abrir interfaz Swagger UI',
          responses: {
            200: {
              description: 'HTML de Swagger UI',
            },
          },
        },
      },
    };
  }

  getTags(): Array<{ name: string; description?: string }> {
    return [
      {
        name: 'Documentacion',
        description: 'Endpoints relacionados con Swagger/OpenAPI',
      },
    ];
  }
}
