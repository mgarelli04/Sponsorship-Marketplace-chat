import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerApiDefinitions } from './apis';

function buildPaths(): Record<string, unknown> {
  return swaggerApiDefinitions.reduce<Record<string, unknown>>((acc, definition) => {
    return { ...acc, ...definition.getPaths() };
  }, {});
}

function buildTags(): Array<{ name: string; description?: string }> {
  return swaggerApiDefinitions.flatMap((definition) => definition.getTags?.() ?? []);
}

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sponsorship Marketplace API',
      version: '1.0.0',
      description: 'Documentacion OpenAPI centralizada en clases por API.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor local',
      },
    ],
    tags: buildTags(),
    paths: buildPaths(),
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
