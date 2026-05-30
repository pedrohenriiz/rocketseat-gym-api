import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let checkInRepository: InMemoryCheckInsRepository;

let sut: ValidateCheckInUseCase;

describe('Validate Check-In use case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();

    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check-in', async () => {
    // vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await sut.execute({ checkInId: createdCheckIn.id });

    expect(createdCheckIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0]?.validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    // vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await expect(
      sut.execute({ checkInId: 'inexistent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const ADVANCE_TIME_BY_21_MINUTES = 1000 * 60 * 21;

    vi.advanceTimersByTime(ADVANCE_TIME_BY_21_MINUTES);

    await expect(
      sut.execute({ checkInId: createdCheckIn.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
