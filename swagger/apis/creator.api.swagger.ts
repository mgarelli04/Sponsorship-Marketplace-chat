import { SwaggerApiDefinition } from './swagger-api.definition';

export class CreatorApiSwagger implements SwaggerApiDefinition {
  getPaths(): Record<string, unknown> {
    return {
      '/api/creator/leads': {
        get: {
          tags: ['Creator'],
          summary: 'Obtener los leads (inquiries) del creator autenticado',
          description: 'Devuelve todas las solicitudes de patrocinio dirigidas al creator, agrupadas por estado',
          responses: {
            200: {
              description: 'Lista de leads del creator',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      leads: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', description: 'ID de la inquiry' },
                            status: { type: 'string', enum: ['pending', 'negotiating', 'closed_won', 'closed_lost'] },
                            campaignGoal: { type: 'string', enum: ['brand_awareness', 'lead_generation', 'product_launch', 'community_building', 'sampling', 'employer_branding'] },
                            budgetMin: { type: 'string', description: 'Presupuesto mínimo' },
                            budgetMax: { type: 'string', description: 'Presupuesto máximo' },
                            currencyCode: { type: 'string' },
                            requirementsText: { type: 'string' },
                            createdAt: { type: 'string', format: 'date-time' },
                            sponsorName: { type: 'string', description: 'Nombre de la empresa sponsor' },
                            sponsorIndustry: { type: 'string', description: 'Industria del sponsor' },
                            packageType: { type: 'string', enum: ['bronze', 'silver', 'gold', 'custom'], description: 'Tipo de paquete' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'No autenticado o no tiene rol de creator' },
            404: { description: 'Creator no encontrado' },
            500: { description: 'Error interno del servidor' },
          },
        },
      },
    };
  }

  getTags(): Array<{ name: string; description?: string }> {
    return [{ name: 'Creator', description: 'Operaciones del creator: leads, dashboard, media-kit' }];
  }
}