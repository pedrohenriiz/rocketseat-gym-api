import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { name, latitude, longitude, description, phone } =
    createGymBodySchema.parse(request.body);

  const registerUseCase = makeCreateGymUseCase();

  const data = await registerUseCase.execute({
    name,
    description,
    latitude,
    longitude,
    phone,
  });

  return reply.status(201).send(data);
}
