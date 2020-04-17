/* eslint-disable no-undef */
import request from 'supertest';
import { factory, truncate, getToken, onlyAuth, onlyAdmin } from '../utils';
import app from '../../src/Start/app';

describe('Delivery Update', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/deliveries/naoImporta', method: 'put' });

  onlyAdmin({ path: '/deliveries/naoImporta', method: 'put' });

  it('Should be able to update a Delivery', async () => {
    const [token, delivery, attrs] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Delivery'),
      factory.attrs('Delivery'),
    ]);

    const { status, body } = await request(app)
      .put(`/deliveries/${delivery.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(attrs);

    expect(status).toBe(200);
    expect(body).toHaveProperty('id', delivery.id);
    expect(body).toHaveProperty('recipient_id', attrs.recipient_id);
    expect(body).toHaveProperty('product', attrs.product);
    expect(body).toHaveProperty('deliveryman_id', attrs.deliveryman_id);
    expect(body).toHaveProperty('updatedAt');
    expect(body).toHaveProperty('createdAt');
  });

  it('Should be return error without valid deliverymanId', async () => {
    const [token, delivery, deliveryman] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Delivery'),
      factory.create('Deliveryman'),
    ]);

    const { id: deliveryman_id } = deliveryman;
    await deliveryman.destroy();

    const { status, body } = await request(app)
      .put(`/deliveries/${delivery.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ deliveryman_id });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid Deliveryman id.');
  });

  it('Should be return error without valid delivery', async () => {
    const [token, delivery, deliveryman] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Delivery'),
      factory.create('Deliveryman'),
    ]);

    const { id: deliveryman_id } = deliveryman;
    const { id } = delivery;
    await delivery.destroy();

    const { status, body } = await request(app)
      .put(`/deliveries/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ deliveryman_id });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid Delivery id.');
  });

  it('Should be return validation fails without valid data', async () => {
    const [token, delivery] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Delivery'),
    ]);

    const attrs = {
      product: null,
      deliveryman_id: 'invalid',
    };

    const { status, body } = await request(app)
      .put(`/deliveries/${delivery.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(attrs);

    expect(status).toBe(400);
    expect(body).toHaveProperty('messages');
  });

  it('Should be return validation fails without data', async () => {
    const [token, delivery] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Delivery'),
    ]);

    const { status, body } = await request(app)
      .put(`/deliveries/${delivery.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(status).toBe(400);
    expect(body).toHaveProperty('messages');
  });
});
