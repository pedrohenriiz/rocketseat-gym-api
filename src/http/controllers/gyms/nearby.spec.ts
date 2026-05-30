import request from 'supertest';

import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gym E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Near gym',
        description: 'Academia dahora',
        latitude: -27.0125789,
        longitude: -42.0489789,
        phone: '12345678900',
      });

    const data = await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Far gym',
        description: 'Academia dahora',
        latitude: -26.0125789,
        longitude: -40.0489789,
        phone: '12345678900',
      });

    console.log(data.body);

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: -27.0125789,
        longitude: -42.0489789,
      })
      .send();

    console.log(response.body);

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'Near gym',
      }),
    ]);
  });
});
