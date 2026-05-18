import { SwaggerApiDefinition } from './swagger-api.definition';

export class SponsorApiSwagger implements SwaggerApiDefinition {
  getPaths(): Record<string, unknown> {
    return {
      '/api/sponsor/inquiry': {
        post: {
          tags: ['Sponsor'],
          summary: 'Enviar una solicitud de patrocinio a un creador',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    creatorId: { type: 'string', description: 'ID del creador' },
                    packageTier: { type: 'string', description: 'Tier del paquete seleccionado (Bronze/Silver/Gold)' },
                    packagePrice: { type: 'number', description: 'Precio del paquete' },
                    campaignGoal: { type: 'string', enum: ['brand_awareness', 'lead_generation', 'product_launch', 'community_building', 'sampling', 'employer_branding'] },
                    budgetMin: { type: 'number' },
                    budgetMax: { type: 'number' },
                    currencyCode: { type: 'string', default: 'EUR' },
                    requirementsText: { type: 'string' },
                    source: { type: 'string', enum: ['public_profile', 'search', 'direct_link', 'admin_created'] },
                  },
                  required: ['creatorId', 'campaignGoal', 'source', 'requirementsText'],
                },
              },
            },
          },
          responses: {
            200: { description: 'Inquiry enviada exitosamente' },
            400: { description: 'Error de validacion o falta de company sponsor' },
            401: { description: 'No autenticado o no es sponsor' },
            500: { description: 'Error interno del servidor' },
          },
        },
      },
    };
  }

  getTags(): Array<{ name: string; description?: string }> {
    return [{ name: 'Sponsor', description: 'Operaciones del sponsor: envio de inquiries' }];
  }
}
