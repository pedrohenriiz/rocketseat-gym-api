import request from 'supertest';

import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create Check In E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const data = await prisma.gym.create({
      data: {
        name: 'Academia',
        description: 'Academia dahora',
        latitude: -27.0125789,
        longitude: -42.0489789,
        phone: '12345678900',
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${data.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.0125789,
        longitude: -42.0489789,
      });

    expect(response.statusCode).toEqual(201);
  });
});
