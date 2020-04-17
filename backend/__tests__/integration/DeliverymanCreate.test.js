/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/Start/app';

import { factory, truncate, getToken, onlyAuth, onlyAdmin } from '../utils';

describe('Deliveryman Store', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/deliverymen', method: 'post' });

  onlyAdmin({ path: '/deliverymen', method: 'post' });

  it('Should can be Store a Deliveryman', async () => {
    const token = await getToken({ isAdmin: true });
    const deliveryman = await factory.attrs('Deliveryman');

    const { status, body } = await request(app)
      .post('/deliverymen')
      .set('Authorization', `Bearer ${token}`)
      .send(deliveryman);

    expect(status).toBe(200);
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it('Should be not able to store an Deliveryman with existent email', async () => {
    const deliveryman = await factory.create('Deliveryman');
    const token = await getToken({ isAdmin: true });
    const { status, body } = await request(app)
      .post('/deliverymen')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'batata',
        email: deliveryman.email,
      });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  it('Should be not able to store an Deliveryman with invalid data', async () => {
    const token = await getToken({ isAdmin: true });
    const { status, body } = await request(app)
      .post('/deliverymen')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '',
        email: 8784514545,
      });

    expect(status).toBe(400);
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('messages');
  });
});
