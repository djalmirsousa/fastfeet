/* eslint-disable no-undef */
import request from 'supertest';
import { factory, truncate, getToken, onlyAuth, onlyAdmin } from '../utils';
import app from '../../src/Start/app';

describe('Deliveryman Delete', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/deliverymen/naoImporta', method: 'delete' });

  onlyAdmin({ path: '/deliverymen/naoImporta', method: 'delete' });

  it('Should can be destroy an Deliveryman', async () => {
    const { id } = await factory.create('Deliveryman');
    const deliveries = await factory.createMany('Delivery', 5, {
      start_date: new Date(),
      deliveryman_id: id,
    });

    const token = await getToken({ isAdmin: true });

    const { status } = await request(app)
      .delete(`/deliverymen/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(200);

    await Promise.all(deliveries.map(delivery => delivery.reload()));
    deliveries.map(delivery => expect(delivery.start_date).toBe(null));
  });

  it('Should can not be destroy an Deliveryman withou valid id', async () => {
    const [token, deliveryman] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Deliveryman'),
    ]);
    const { id } = deliveryman;

    await deliveryman.destroy();

    const { status, body } = await request(app)
      .delete(`/deliverymen/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(400);
    expect(body.message).toBe('Invalid deliveryman id.');
    expect(body).not.toHaveProperty('error');
  });
});
