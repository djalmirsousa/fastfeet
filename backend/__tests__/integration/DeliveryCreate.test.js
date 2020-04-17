/* eslint-disable import/first */
/* eslint-disable no-undef */
jest.mock('../../src/Lib/Queue');
import request from 'supertest';
import app from '../../src/Start/app';

import { factory, truncate, getToken, onlyAuth, onlyAdmin } from '../utils';
import Queue from '../../src/Lib/Queue';

describe('Delivery Create', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/deliveries', method: 'post' });

  onlyAdmin({ path: '/deliveries', method: 'post' });

  it('Should can be Create a Delivery', async () => {
    const [token, attrs] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.attrs('Delivery'),
    ]);

    const { deliveryman_id, recipient_id, product } = attrs;

    const { status, body } = await request(app)
      .post(`/deliveries`)
      .set('Authorization', `Bearer ${token}`)
      .send(attrs);

    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('deliveryman_id', deliveryman_id);
    expect(body).toHaveProperty('recipient_id', recipient_id);
    expect(body).toHaveProperty('product', product);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
    expect(Queue.add.mock.calls.length).toBe(1);
  });

  it('Should be not able to store an Delivery with invalid data', async () => {
    const token = await getToken({ isAdmin: true });
    const { status, body } = await request(app)
      .post(`/deliveries`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        product: null,
        recipient_id: null,
        deliveryman_id: null,
      });

    expect(status).toBe(400);
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('messages');
  });

  it('Should be not able to store an Delivery with invalid Deliveryman Id', async () => {
    const [token, attrs] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.attrs('Delivery', { deliveryman_id: 1 }),
    ]);

    const { status, body } = await request(app)
      .post(`/deliveries`)
      .set('Authorization', `Bearer ${token}`)
      .send(attrs);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid Deliveryman id.');
  });

  it('Should be not able to store an Delivery with invalid Recipient Id', async () => {
    const [token, attrs] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.attrs('Delivery', { recipient_id: 1 }),
    ]);

    const { status, body } = await request(app)
      .post(`/deliveries`)
      .set('Authorization', `Bearer ${token}`)
      .send(attrs);

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid Recipient id.');
  });
});
