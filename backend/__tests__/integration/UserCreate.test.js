/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/Start/app';

import { factory, truncate } from '../utils';

describe('User Store', () => {
  afterEach(async () => {
    await truncate();
  });

  it('Should be able to store an User', async () => {
    const user = await factory.attrs('User');
    const { status, body } = await request(app)
      .post('/users')
      .send({ ...user, passwordConfirm: user.password });

    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', user.name);
    expect(body).toHaveProperty('email', user.email);
    expect(body).not.toHaveProperty('password');
    expect(body).not.toHaveProperty('password_hash');
  });

  it('Should be not able to store an User with existent email', async () => {
    const user = await factory.create('User');
    const { status, body } = await request(app)
      .post('/users')
      .send({
        name: 'batata',
        email: user.email,
        password: '123456',
        passwordConfirm: '123456',
      });

    expect(status).toBe(400);
    expect(body).toHaveProperty('message');
  });

  it('Should be not able to store an User with invalid data', async () => {
    const { status, body } = await request(app)
      .post('/users')
      .send({
        name: '',
        password: true,
        passwordConfirm: false,
        email: 8784514545,
      });

    expect(status).toBe(400);
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('messages');
  });

  it('Should be not able to store an User without passwordConfirm', async () => {
    const user = await factory.attrs('User');

    const { status, body } = await request(app)
      .post('/users')
      .send(user);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('messages');
  });
});
