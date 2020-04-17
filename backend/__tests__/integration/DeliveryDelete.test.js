/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/Start/app';

import { factory, truncate, onlyAdmin, onlyAuth, getToken } from '../utils';

import Delivery from '../../src/App/Models/Delivery';

describe('Delivery Delete', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/deliveries/1', method: 'delete' });

  onlyAdmin({ path: '/deliveries/1', method: 'delete' });

  it('Should be able to delete Delivery if not Retired.', async () => {
    const [token, delivery] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Delivery'),
    ]);

    const { status } = await request(app)
      .delete(`/deliveries/${delivery.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(200);
    expect(await Delivery.findByPk(delivery.id, { paranoid: false })).toBe(
      null
    );
  });

  it('Should be return error if started Delivery.', async () => {
    const [token, delivery] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Delivery', { start_date: new Date() }),
    ]);

    const {
      status,
      body: { message },
    } = await request(app)
      .delete(`/deliveries/${delivery.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(400);
    expect(message).toBe('Started deliveries cannot be excluded.');
  });

  it('Should be return error if Delivery not exists.', async () => {
    const [token, delivery] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Delivery'),
    ]);

    await delivery.destroy();

    const {
      status,
      body: { message },
    } = await request(app)
      .delete(`/deliveries/${delivery.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(400);
    expect(message).toBe('Invalid Delivery id.');
  });
});
