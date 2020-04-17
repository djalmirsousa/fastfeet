/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/Start/app';

import {
  factory,
  truncate,
  getToken,
  faker,
  onlyAdmin,
  onlyAuth,
} from '../utils';

describe('Deliveries List', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/problems', method: 'get' });

  onlyAdmin({ path: '/problems', method: 'get' });

  it('Should can be list deliveries with pagination.', async () => {
    const total = faker.integer({ min: 1, max: 10 });
    const quantity = faker.integer({ min: 1, max: 10 });
    const page = Math.ceil(total / quantity);

    const [token] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.createMany('Delivery', total),
    ]);

    const {
      status,
      body: { data, count, totalPages },
    } = await request(app)
      .get('/deliveries')
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

  it('Deliverymens must be able to list their Deliveries (not delivered).', async () => {
    const deliveryman = await factory.create('Deliveryman');

    const [deliveries] = await Promise.all([
      factory.createMany('Delivery', 3, {
        deliveryman_id: deliveryman.id,
      }),
      factory.createMany('Delivery', 2),
      factory.create('Delivery', {
        deliveryman_id: deliveryman.id,
        end_date: new Date(),
      }),
    ]);

    const { status, body } = await request(app)
      .get(`/deliverymen/${deliveryman.id}/deliveries`)
      .send();

    expect(status).toBe(200);
    expect(body.count).toBe(deliveries.length);
    body.data.forEach(e => {
      expect(e.end_date).toBe(null);
    });
  });

  it('Deliverymens must be able to list their Deliveries (delivered).', async () => {
    const deliveryman = await factory.create('Deliveryman');

    const [deliveries] = await Promise.all([
      factory.createMany('Delivery', 3, {
        deliveryman_id: deliveryman.id,
        end_date: new Date(),
      }),
      factory.createMany('Delivery', 2),
      factory.create('Delivery', { deliveryman_id: deliveryman.id }),
    ]);

    const { status, body } = await request(app)
      .get(`/deliverymen/${deliveryman.id}/deliveries`)
      .query({ delivered: true })
      .send();

    expect(status).toBe(200);
    expect(body.count).toBe(deliveries.length);
    body.data.forEach(e => {
      expect(!!e.end_date).toBe(true);
    });
  });
});
