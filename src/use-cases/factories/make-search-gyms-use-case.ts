import { SearchGymUseCase } from '../search-gyms';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeSearchGymsUseCase() {
  const gymRepository = new PrismaGymsRepository();

  const useCase = new SearchGymUseCase(gymRepository);

  return useCase;
}
