import type { FastifyInstance } from 'fastify';
import { register } from '@/http/controllers/users/register-controller';
import { authenticate } from '@/http/controllers/users/authenticate-controller';
import { profile } from '@/http/controllers/users/profile-controller';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { refresh } from './refresh';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register);

  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refresh);

  // Autenticado
  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
