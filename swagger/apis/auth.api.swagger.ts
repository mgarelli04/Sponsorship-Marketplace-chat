import { SwaggerApiDefinition } from './swagger-api.definition';

export class AuthApiSwagger implements SwaggerApiDefinition {
  getPaths(): Record<string, unknown> {
    return {
      '/api/auth/register': {
        post: {
          tags: ['Autenticacion'],
          summary: 'Registrar un nuevo usuario',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email', description: 'Correo electronico del usuario' },
                    password: { type: 'string', minLength: 8, description: 'Contrasena (min. 8 caracteres)' },
                    fullName: { type: 'string', description: 'Nombre completo del usuario' },
                    userType: { type: 'string', enum: ['creator', 'sponsor'], description: 'Tipo de usuario' },
                  },
                  required: ['email', 'password', 'fullName', 'userType'],
                },
              },
            },
          },
          responses: {
            201: { description: 'Usuario creado exitosamente' },
            400: { description: 'Error de validacion' },
            500: { description: 'Error interno del servidor' },
          },
        },
      },
      '/api/auth/signin': {
        post: {
          tags: ['Autenticacion'],
          summary: 'Iniciar sesion con credenciales',
          responses: {
            200: { description: 'Autenticacion exitosa' },
            401: { description: 'Credenciales invalidas' },
          },
        },
      },
      '/api/auth/session': {
        get: {
          tags: ['Autenticacion'],
          summary: 'Obtener sesion actual',
          responses: {
            200: { description: 'Datos de la sesion del usuario autenticado' },
          },
        },
      },
      '/api/auth/providers': {
        get: {
          tags: ['Autenticacion'],
          summary: 'Listar proveedores de autenticacion',
          responses: {
            200: { description: 'Mapa de proveedores disponibles' },
          },
        },
      },
      '/api/auth/csrf': {
        get: {
          tags: ['Autenticacion'],
          summary: 'Obtener token CSRF',
          responses: {
            200: { description: 'Token CSRF' },
          },
        },
      },
      '/api/auth/signout': {
        post: {
          tags: ['Autenticacion'],
          summary: 'Cerrar sesion',
          responses: {
            200: { description: 'Sesion cerrada exitosamente' },
          },
        },
      },
    };
  }

  getTags(): Array<{ name: string; description?: string }> {
    return [{ name: 'Autenticacion', description: 'Registro, inicio de sesion y gestion de sesiones' }];
  }
}
