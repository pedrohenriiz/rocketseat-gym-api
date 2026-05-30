import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userRequest = request.user;

  const getUserProfile = makeGetUserProfileUseCase();

  const { user } = await getUserProfile.execute({ id: userRequest.sub });

  return reply.status(200).send({
    profile: { ...user, password_hash: undefined },
  });
}
