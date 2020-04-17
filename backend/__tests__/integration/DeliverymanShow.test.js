/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/Start/app';

import { factory, truncate, getToken, onlyAdmin, onlyAuth } from '../utils';

describe('Deliveryman Show', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/deliverymen/naoImporta', method: 'get' });

  onlyAdmin({ path: '/deliverymen/naoImporta', method: 'get' });

  it('Should can be Show a Deliveryman', async () => {
    const [token, deliveryman] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Deliveryman'),
    ]);

    const { status, body } = await request(app)
      .get(`/deliverymen/${deliveryman.id}`)
      .set('Authorization', `Berar ${token}`)
      .send();

    expect(status).toBe(200);
    // expect({
    //   ...body,
    //   createdAt: new Date(body.createdAt),
    //   updatedAt: new Date(body.updatedAt),
    //   avatar_url: null,
    // }).toStrictEqual(deliveryman.toJSON());
    expect(body).toHaveProperty('id', deliveryman.id);
    expect(body).toHaveProperty('name', deliveryman.name);
    expect(body).toHaveProperty('email', deliveryman.email);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it('Should can not be Show a Deliveryman with invalid id', async () => {
    const [token, deliveryman] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Deliveryman'),
    ]);

    await deliveryman.destroy();

    const { status, body } = await request(app)
      .get(`/deliverymen/${deliveryman.id}`)
      .set('Authorization', `Berar ${token}`)
      .send();

    expect(status).toBe(400);
    expect(body.message).toBe('Invalid deliveryman id.');
    expect(body).not.toHaveProperty('error');
  });
});
