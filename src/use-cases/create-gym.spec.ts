import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;

let gymUseCase: CreateGymUseCase;

describe('Create Gym use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();

    gymUseCase = new CreateGymUseCase(gymsRepository);
  });

  it('should create a new gym', async () => {
    const { gym } = await gymUseCase.execute({
      name: 'Academia',
      description: 'Academia dahora',
      latitude: -27.0125789,
      longitude: -42.0489789,
      phone: '12345678900',
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
