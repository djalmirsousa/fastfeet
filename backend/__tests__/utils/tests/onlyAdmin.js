/* eslint-disable no-undef */
import request from 'supertest';
import getToken from '../getToken';
import app from '../../../src/Start/app';

export default ({ path, method }) =>
  it(`should be return a error, without admin user (${path})`, async () => {
    const token = await getToken();

    const {
      status,
      body: { error },
    } = await request(app)
      [method](path)
      .set('Authorization', `Berar ${token}`)
      .send();

    expect(status).toBe(401);
    expect(error).toBe('Not permited, only for admins.');
  });
