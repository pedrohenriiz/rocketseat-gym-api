import { beforeEach, describe, expect, it } from 'vitest';
import { compare, hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('12345678', 6),
    });

    const { user } = await sut.execute({
      email: 'johndoe@gmail.com',
      password: '12345678',
    });

    const isPasswordCorrectlyHashed = await compare(
      '12345678',
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('12345678', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'johndoe@gmail.com',
        password: '12313',
      }),
    ).rejects.instanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@gmail.com',
        password: '12345678',
      }),
    ).rejects.instanceOf(InvalidCredentialsError);
  });
});
