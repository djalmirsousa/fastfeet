/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/Start/app';

import { factory, truncate, getToken, onlyAdmin, onlyAuth } from '../utils';

describe('Recipient Store', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/recipients', method: 'post' });

  onlyAdmin({ path: '/recipients', method: 'post' });

  it('Should be able to store an User', async () => {
    const recipient = await factory.attrs('Recipient');
    const token = await getToken({ isAdmin: true });
    const { status, body } = await request(app)
      .post('/recipients')
      .set('authorization', `Bearer ${token}`)
      .send(recipient);

    expect(status).toBe(200);
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('street');
    expect(body).toHaveProperty('number');
    expect(body).toHaveProperty('complement');
    expect(body).toHaveProperty('state');
    expect(body).toHaveProperty('city');
    expect(body).toHaveProperty('zip');
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it('Should be not able to store an Recipient with invalid data', async () => {
    const recipient = {};
    const token = await getToken({ isAdmin: true });
    const { status, body } = await request(app)
      .post('/recipients')
      .set('authorization', `Bearer ${token}`)
      .send(recipient);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('messages');
  });
});
