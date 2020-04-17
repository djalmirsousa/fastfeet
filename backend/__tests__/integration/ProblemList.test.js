/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/Start/app';

import {
  factory,
  getToken,
  truncate,
  onlyAdmin,
  onlyAuth,
  faker,
} from '../utils';

describe('Problem List', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/problems', method: 'get' });

  onlyAdmin({ path: '/problems', method: 'get' });

  onlyAuth({ path: '/deliveries/1/problems', method: 'get' });

  onlyAdmin({ path: '/deliveries/1/problems', method: 'get' });

  it('Should be able to list all Problems.', async () => {
    const total = faker.integer({ min: 1, max: 10 });
    const quantity = faker.integer({ min: 1, max: 10 });
    const page = Math.ceil(total / quantity);

    const [token] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.createMany('Problem', total),
    ]);

    const {
      status,
      body: { data, count, totalPages },
    } = await request(app)
      .get('/problems')
      .query({ page, quantity })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(200);
    expect(data).toHaveLength(
      total > quantity ? quantity + (total - page * quantity) : total
    );
    expect(Number(totalPages)).toBe(Math.ceil(total / quantity));
    expect(Number(count)).toBe(total);
  });

  it('Should be able to list all Problems for specific Delivery', async () => {
    const total = faker.integer({ min: 1, max: 10 });
    const quantity = faker.integer({ min: 1, max: 10 });
    const page = Math.ceil(total / quantity);

    const delivery = await factory.create('Delivery');

    const [token] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.createMany('Problem', 2),
      factory.createMany('Problem', total, { delivery_id: delivery.id }),
    ]);

    const {
      status,
      body: { data, count, totalPages },
    } = await request(app)
      .get(`/deliveries/${delivery.id}/problems`)
      .query({ page, quantity })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(200);
    expect(data).toHaveLength(
      total > quantity ? quantity + (total - page * quantity) : total
    );
    expect(Number(totalPages)).toBe(Math.ceil(total / quantity));
    expect(Number(count)).toBe(total);
  });

  it('Should be able to list all Problems for specific Delivery (Delivery not have problem).', async () => {
    const delivery = await factory.create('Delivery');

    const [token] = await Promise.all([getToken({ isAdmin: true })]);

    const {
      status,
      body: { data, count, totalPages },
    } = await request(app)
      .get(`/deliveries/${delivery.id}/problems`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(200);
    expect(data).toHaveLength(0);
    expect(Number(totalPages)).toBe(0);
    expect(Number(count)).toBe(0);
  });

  it('Should be able to list all Problems for specific Delivery. If Delvery not exists return [].', async () => {
    const delivery = await factory.create('Delivery');
    const { id } = delivery;
    await delivery.destroy();

    const [token] = await Promise.all([getToken({ isAdmin: true })]);

    const {
      status,
      body: { data, count, totalPages },
    } = await request(app)
      .get(`/deliveries/${id}/problems`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(200);
    expect(data).toHaveLength(0);
    expect(Number(totalPages)).toBe(0);
    expect(Number(count)).toBe(0);
  });
});
