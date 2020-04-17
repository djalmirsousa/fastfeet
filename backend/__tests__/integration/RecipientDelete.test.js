/* eslint-disable no-undef */
import request from 'supertest';
import { factory, truncate, getToken, onlyAuth, onlyAdmin } from '../utils';
import app from '../../src/Start/app';

import Recipient from '../../src/App/Models/Recipient';

describe('Recipients Delete', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/recipients/1', method: 'delete' });

  onlyAdmin({ path: '/recipients/1', method: 'delete' });

  it('Should be able to delete Recipients.', async () => {
    const [token, recipient] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Recipient'),
    ]);

    const { status } = await request(app)
      .delete(`/recipients/${recipient.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(200);
    expect(await Recipient.findByPk(recipient.id)).toBe(null);
  });

  it('Should be return error if Recipient not exists.', async () => {
    const [token, recipient] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.create('Recipient'),
    ]);

    await recipient.destroy();

    const {
      status,
      body: { message },
    } = await request(app)
      .delete(`/recipients/${recipient.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(400);
    expect(message).toBe('Invalid Recipient id.');
  });
});
