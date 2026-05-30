import { Prisma, type Gym } from '@/generated/prisma/client';
import type { GymCreateInput } from '@/generated/prisma/models';
import type {
  FindManyNearbyRepositoryProps,
  GymsRepository,
} from '../gyms-repository';
import { prisma, schema } from '@/lib/prisma';

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return gym;
  }
  async create(data: GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({ data });

    return gym;
  }
  async searchMany(query: string, page: number): Promise<Gym[]> {
    const checkIns = await prisma.gym.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    return checkIns;
  }
  async findManyNearby(params: FindManyNearbyRepositoryProps): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * FROM ${Prisma.raw(`"${schema}"."gyms"`)}
        WHERE ( 6371 * acos( cos( radians(${params.latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${params.longitude}) ) + sin( radians(${params.latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }
}
