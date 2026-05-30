import request from 'supertest';

import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gym E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Academia',
        description: 'Academia dahora',
        latitude: -27.0125789,
        longitude: -42.0489789,
        phone: '12345678900',
      });

    await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Academia 2',
        description: 'Academia dahora',
        latitude: -27.0125789,
        longitude: -42.0489789,
        phone: '12345678900',
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Academia 2',
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'Academia 2',
      }),
    ]);
  });
});
