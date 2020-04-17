/* eslint-disable import/first */
/* eslint-disable no-undef */
jest.mock('../../src/Lib/Queue');
import request from 'supertest';
import app from '../../src/Start/app';

import { factory, truncate, getToken, onlyAuth, onlyAdmin } from '../utils';

import Delivery from '../../src/App/Models/Delivery';

import Queue from '../../src/Lib/Queue';

describe('Delivery Cancel', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/problems/1/cancel-delivery', method: 'delete' });

  onlyAdmin({ path: '/problems/1/cancel-delivery', method: 'delete' });

  it('Should can be cancel a Delivery with admin user.', async () => {
    const [token, problem] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Problem'),
    ]);

    const { status } = await request(app)
      .delete(`/problems/${problem.id}/cancel-delivery`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(200);

    const deletedDelivery = await Delivery.findByPk(problem.delivery_id, {
      paranoid: false,
    });

    expect(deletedDelivery).toHaveProperty('canceledAt');
    expect(deletedDelivery.canceledAt).not.toBe(null);
    expect(Queue.add.mock.calls.length).toBe(1);
  });

  it('Should be return error if problem id is invalid.', async () => {
    const [token, problem] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Problem'),
    ]);

    const { id } = problem;

    await problem.destroy();

    const {
      status,
      body: { message },
    } = await request(app)
      .delete(`/problems/${id}/cancel-delivery`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(400);
    expect(message).toBe('Invalid Problem.');
    expect(Queue.add.mock.calls.length).toBe(0);
  });

  it('Should be return error if delivery is canceled.', async () => {
    const delivery = await factory.create('Delivery');

    const [token, problem] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Problem', { delivery_id: delivery.id }),
    ]);

    await delivery.destroy();

    const { id } = problem;

    const {
      status,
      body: { message },
    } = await request(app)
      .delete(`/problems/${id}/cancel-delivery`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(400);
    expect(message).toBe('Delivery alread been canceled.');
    expect(Queue.add.mock.calls.length).toBe(0);
  });
});
