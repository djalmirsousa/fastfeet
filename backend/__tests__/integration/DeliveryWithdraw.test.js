/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/Start/app';

import { factory, truncate } from '../utils';

describe('Deliveryman Store', () => {
  afterEach(async () => {
    await truncate();
  });

  it('Deliveryman should be able to withdraw a Delivery.', async () => {
    const { id, deliveryman_id } = await factory.create('Delivery');

    const start_date = new Date();
    start_date.setHours(12, 0, 0);

    const { status, body } = await request(app)
      .post(`/deliverymen/${deliveryman_id}/deliveries/${id}/withdraw`)
      .send({ start_date });

    expect(status).toBe(200);
    expect(body.start_date).not.toBe(null);
  });

  it('Deliveryman should not be able to withdraw a Delivery before 08:00.', async () => {
    const { id, deliveryman_id } = await factory.create('Delivery');

    const start_date = new Date();
    start_date.setHours(7, 59, 0);

    const { status, body } = await request(app)
      .post(`/deliverymen/${deliveryman_id}/deliveries/${id}/withdraw`)
      .send({ start_date });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  it('Deliveryman should not be able to withdraw a Delivery after 18:00.', async () => {
    const { id, deliveryman_id } = await factory.create('Delivery');

    const start_date = new Date();
    start_date.setHours(18, 1, 0);

    const { status, body } = await request(app)
      .post(`/deliverymen/${deliveryman_id}/deliveries/${id}/withdraw`)
      .send({ start_date });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  it('Não poderá recolher a Delivery de outro Deliveryman.', async () => {
    const [{ id }, { id: deliveryman_id }] = await Promise.all([
      factory.create('Delivery'),
      factory.create('Deliveryman'),
    ]);

    const start_date = new Date();
    start_date.setHours(13, 0, 0);

    const { status, body } = await request(app)
      .post(`/deliverymen/${deliveryman_id}/deliveries/${id}/withdraw`)
      .send({ start_date });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid Delivery id.');
  });

  it('Deliveryman should not be able to withdraw if maximum withdraws exceeded.', async () => {
    const start_date = new Date();
    start_date.setHours(13, 0, 0);

    const deliveryman = await factory.create('Deliveryman');

    const [delivery] = await Promise.all([
      factory.create('Delivery', {
        deliveryman_id: deliveryman.id,
      }),
      factory.createMany('Delivery', 5, {
        start_date,
        deliveryman_id: deliveryman.id,
      }),
    ]);

    const { status, body } = await request(app)
      .post(`/deliverymen/${deliveryman.id}/deliveries/${delivery.id}/withdraw`)
      .send({ start_date });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Maximum withdrawals exceeded.');
  });
});
