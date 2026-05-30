import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/client';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOFCheckInsError } from './errors/max-number-of-check-ins-error';

let checkInRepository: InMemoryCheckInsRepository;
let gymRepository: InMemoryGymsRepository;

let sut: CheckInUseCase;

describe('Check In use case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymRepository = new InMemoryGymsRepository();

    sut = new CheckInUseCase(checkInRepository, gymRepository);

    vi.useFakeTimers();

    await gymRepository.create({
      id: '123',
      name: 'Javascript',
      description: 'Teste',
      latitude: 0,
      longitude: 0,
      phone: '',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: '123',
      userId: '12312',
      userLatitude: 0,
      userLongitude: 0,
    });

    console.log(checkIn);

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: '123',
      userId: '12312',
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: '123',
        userId: '12312',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOFCheckInsError);
  });

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: '123',
      userId: '12312',
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: '123',
      userId: '12312',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    gymRepository.items.push({
      id: '2',
      name: 'Javascript',
      description: 'Teste',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
      phone: '',
    });

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await expect(() =>
      sut.execute({
        gymId: '123',
        userId: '12312',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
