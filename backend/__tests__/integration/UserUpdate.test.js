/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/Start/app';

import { factory, truncate, onlyAuth, getToken } from '../utils';

describe('User Update', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/users/1', method: 'put' });

  it('should be possible to update a User (name, password)', async () => {
    const password = '123456';
    const user = await factory.create('User');
    const token = await getToken({ isAdmin: true });

    const newName = 'Novo Nome';

    const { status, body } = await request(app)
      .put(`/users/${user.id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ name: newName, password, passwordConfirm: password });

    expect(status).toBe(200);
    expect(body).toHaveProperty('id', user.id);
    expect(body).toHaveProperty('name', newName);
    expect(body).toHaveProperty('email', user.email);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('createdAt');

    await user.reload();

    expect(await user.checkPassword(password)).toBe(true);
  });

  it('should be possible to update a User password ONLY', async () => {
    const password = '123456';
    const user = await factory.create('User');
    const token = await getToken({ isAdmin: true });

    const { status, body } = await request(app)
      .put(`/users/${user.id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ password, passwordConfirm: password });

    expect(status).toBe(200);
    expect(body).toHaveProperty('id', user.id);
    expect(body).toHaveProperty('name', user.name);
    expect(body).toHaveProperty('email', user.email);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('createdAt');

    await user.reload();

    expect(await user.checkPassword(password)).toBe(true);
  });

  it('should can not update user with invalid user id', async () => {
    const password = '123456';
    const newName = await 'Novo Nome';

    const user = await factory.create('User', { password });
    const { id } = user;
    await user.destroy();

    const token = await getToken({ isAdmin: true });

    const {
      status,
      body: { message },
    } = await request(app)
      .put(`/users/${id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ name: newName, password, passwordConfirm: password });

    expect(status).toBe(400);
    expect(message).toBe('Invalid User id.');
  });

  it('Only admins can be update other users.', async () => {
    const password = '123456';
    const newName = await 'Novo Nome';

    const user = await factory.create('User');

    const token = await getToken({ isAdmin: false });

    const {
      status,
      body: { message },
    } = await request(app)
      .put(`/users/${user.id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ name: newName, password, passwordConfirm: password });

    expect(status).toBe(400);
    expect(message).toBe('Invalid User id.');
  });

  it('Not admins can be update yourself.', async () => {
    const password = '123456';
    const newName = await 'Novo Nome';

    const user = await factory.create('User');

    const {
      body: { token },
    } = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: user.password });

    const { status, body } = await request(app)
      .put(`/users/${user.id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ name: newName, password, passwordConfirm: password });

    expect(status).toBe(200);
    expect(body).toHaveProperty('id', user.id);
    expect(body).toHaveProperty('name', newName);
    expect(body).toHaveProperty('email', user.email);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('createdAt');

    await user.reload();

    expect(await user.checkPassword(password)).toBe(true);
  });

  it('Should return error if confirmPassword not provided.', async () => {
    const password = '123456';
    const user = await factory.create('User');
    const token = await getToken({ isAdmin: true });

    const newName = 'Novo Nome';

    const { status, body } = await request(app)
      .put(`/users/${user.id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ name: newName, password });

    expect(status).toBe(400);
    expect(body.error).toBe('Validation fails');
    expect(body).toHaveProperty('messages');
  });
});
