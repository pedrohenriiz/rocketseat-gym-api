import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;

let sut: FetchNearbyGymsUseCase;

describe('Search Gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();

    sut = new FetchNearbyGymsUseCase(gymsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      name: 'Near gym',
      description: 'Academia dahora',
      latitude: -27.0125789,
      longitude: -42.0489789,
      phone: '12345678900',
    });

    await gymsRepository.create({
      name: 'Far gym',
      description: 'Academia dahora',
      latitude: -26.0125789,
      longitude: -40.0489789,
      phone: '12345678900',
    });

    const { gyms } = await sut.execute({
      userLatitude: -27.0125789,
      userLongitude: -42.0489789,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ name: 'Near gym' })]);
  });

  //   it('should be able to fetch paginated gym search', async () => {
  //     for (let i = 1; i <= 22; i++) {
  //       await gymsRepository.create({
  //         name: `gym ${i}`,
  //         description: 'Academia dahora',
  //         latitude: -27.0125789,
  //         longitude: -42.0489789,
  //         phone: '12345678900',
  //       });
  //     }

  //     const { gyms } = await sut.execute({
  //       query: 'gym',
  //       page: 2,
  //     });

  //     expect(gyms).toHaveLength(2);
  //     expect(gyms).toEqual([
  //       expect.objectContaining({ name: 'gym 21' }),
  //       expect.objectContaining({ name: 'gym 22' }),
  //     ]);
  //   });
});
