import { DocsApiSwagger } from './docs.api.swagger';
import { SwaggerApiDefinition } from './swagger-api.definition';

// Registro central de APIs documentadas en Swagger.
// Cada API de negocio debe añadir aqui su clase de documentacion.
export const swaggerApiDefinitions: SwaggerApiDefinition[] = [
  new DocsApiSwagger(),
];
