import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('12345678', 6),
    });

    const { user } = await sut.execute({
      id: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toBe('John Doe');
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'invalid-user-id',
      }),
    ).rejects.instanceOf(ResourceNotFoundError);
  });
});
