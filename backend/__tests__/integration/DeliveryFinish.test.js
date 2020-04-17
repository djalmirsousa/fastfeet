/* eslint-disable no-undef */
import request from 'supertest';
import path from 'path';
import app from '../../src/Start/app';

import { factory, truncate } from '../utils';

describe('Deliveryman Store', () => {
  afterEach(async () => {
    await truncate();
  });

  it('Deliveryman should be able to Finish a Delivery.', async () => {
    const { id, deliveryman_id } = await factory.create('Delivery');

    const { status, body } = await request(app)
      .post(`/deliverymen/${deliveryman_id}/deliveries/${id}/finish`)
      .attach(
        'file',
        path.resolve(__dirname, '..', 'utils', 'files', 'img.jpg'),
        'profile'
      );

    expect(status).toBe(200);
    expect(body.end_date).not.toBe(null);
    expect(body.signature_id).not.toBe(null);
  });

  it('Não poderá finalizar a Delivery de outro Deliveryman.', async () => {
    const [{ id }, { id: deliveryman_id }] = await Promise.all([
      factory.create('Delivery'),
      factory.create('Deliveryman'),
    ]);

    const { status, body } = await request(app)
      .post(`/deliverymen/${deliveryman_id}/deliveries/${id}/finish`)
      .attach(
        'file',
        path.resolve(__dirname, '..', 'utils', 'files', 'img.jpg'),
        'profile'
      );

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid Delivery id.');
  });

  it('Should not able to finish without Signature image.', async () => {
    const { id, deliveryman_id } = await factory.create('Delivery');

    const { status, body } = await request(app).post(
      `/deliverymen/${deliveryman_id}/deliveries/${id}/finish`
    );

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid File.');
  });
});
