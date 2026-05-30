import request from 'supertest';

import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Academia',
        description: 'Academia dahora',
        latitude: -27.0125789,
        longitude: -42.0489789,
        phone: '12345678900',
      });

    expect(response.statusCode).toEqual(201);
  });
});
