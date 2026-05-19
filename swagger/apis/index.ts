import { DocsApiSwagger } from './docs.api.swagger';
import { AuthApiSwagger } from './auth.api.swagger';
import { SponsorApiSwagger } from './sponsor.api.swagger';
import { CreatorApiSwagger } from './creator.api.swagger';
import { SwaggerApiDefinition } from './swagger-api.definition';

export const swaggerApiDefinitions: SwaggerApiDefinition[] = [
  new DocsApiSwagger(),
  new AuthApiSwagger(),
  new SponsorApiSwagger(),
  new CreatorApiSwagger(),
];
