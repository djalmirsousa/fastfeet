/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../../src/Start/app';

export default ({ path, method }) =>
  it(`should be return a error, without auth (${path})`, async () => {
    const {
      status,
      body: { error },
    } = await request(app)
      [method](path)
      .send();

    expect(status).toBe(401);
    expect(error).toBe('Token not provided.');
  });
