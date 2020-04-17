/* eslint-disable no-undef */
import request from 'supertest';
import path from 'path';
import { factory, truncate, getToken, onlyAuth, onlyAdmin } from '../utils';
import app from '../../src/Start/app';

describe('Deliveryman Update', () => {
  afterEach(async () => {
    await truncate();
  });

  onlyAuth({ path: '/deliverymen/naoImporta', method: 'put' });

  onlyAdmin({ path: '/deliverymen/naoImporta', method: 'put' });

  it('Should can be update a Deliveryman', async () => {
    const [deliveryman, newAttrs, token] = await Promise.all([
      factory.create('Deliveryman', { avatar_id: null }),
      factory.attrs('Deliveryman', { avatar_id: null }),
      getToken({ isAdmin: true }),
    ]);

    const { status, body } = await request(app)
      .put(`/deliverymen/${deliveryman.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newAttrs);

    expect(status).toBe(200);
    expect(body).toHaveProperty('name', newAttrs.name);
    expect(body).toHaveProperty('email', deliveryman.email);
    expect(body).toHaveProperty('id', deliveryman.id);
  });

  it('Should can be add a Deliveryman avatar img', async () => {
    const [deliveryman, token] = await Promise.all([
      factory.create('Deliveryman', { avatar_id: null }),
      getToken({ isAdmin: true }),
    ]);

    const { status, body } = await request(app)
      .post(`/deliverymen/${deliveryman.id}/avatar`)
      .set('Authorization', `Bearer ${token}`)
      .attach(
        'file',
        path.resolve(__dirname, '..', 'utils', 'files', 'img.jpg'),
        'profile'
      );

    expect(status).toBe(200);
    expect(body).toHaveProperty('id', deliveryman.id);
    expect(body).toHaveProperty('avatar_url');
    expect(body).toHaveProperty('avatar_id');
    expect(body).toHaveProperty('email', deliveryman.email);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it('Should can not update Deliveryman without valid data', async () => {
    const token = await getToken({ isAdmin: true });
    const { status, body } = await request(app)
      .put(`/deliverymen/naoImporta`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(status).toBe(400);
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('messages');
  });

  it('Should can not be Update a Deliveryman with invalid id', async () => {
    const [token, attrs, deliveryman] = await Promise.all([
      getToken({ isAdmin: true }),
      factory.attrs('Deliveryman'),
      factory.create('Deliveryman'),
    ]);

    const { id } = deliveryman;

    await deliveryman.destroy({ force: true });

    const { status, body } = await request(app)
      .put(`/deliverymen/${id}`)
      .set('Authorization', `Berar ${token}`)
      .send(attrs);

    expect(status).toBe(400);
    expect(body.message).toBe('Invalid Deliveryman id.');
    expect(body).not.toHaveProperty('error');
  });
});
