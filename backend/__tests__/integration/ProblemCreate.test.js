/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/Start/app';

import { factory, truncate } from '../utils';

describe('Problem Create', () => {
  afterEach(async () => {
    await truncate();
  });

  it('Should be able to Create a Problem.', async () => {
    const delivery = await factory.create('Delivery');
    const attrs = await factory.attrs('Problem', { delivery_id: null });

    const { status, body } = await request(app)
      .post(`/deliveries/${delivery.id}/problems`)
      .send(attrs);

    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('description', attrs.description);
    expect(body).toHaveProperty('delivery_id', String(delivery.id));
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it('Should be return a Error if DeliveryId not exists.', async () => {
    const delivery = await factory.create('Delivery');
    const attrs = await factory.attrs('Problem', { delivery_id: null });
    await delivery.destroy();

    const {
      status,
      body: { message },
    } = await request(app)
      .post(`/deliveries/${delivery.id}/problems`)
      .send(attrs);

    expect(status).toBe(400);
    expect(message).toBe('Invalid Delivery id.');
  });

  it('Should be return a Error if Problem attrs is invalid (validator).', async () => {
    const delivery = await factory.create('Delivery');
    const attrs = { description: null };

    const { status, body } = await request(app)
      .post(`/deliveries/${delivery.id}/problems`)
      .send(attrs);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', 'Validation fails');
    expect(body).toHaveProperty('messages');
  });
});
