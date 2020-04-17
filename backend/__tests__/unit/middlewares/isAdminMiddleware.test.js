/* eslint-disable no-undef */

import isAdminMiddleware from '../../../src/App/Middlewares/isAdmin';

describe('is Admin', () => {
  it('Only for Admin Users', () => {
    const req = {
      auth: { isAdmin: true },
    };
    const res = {};
    const next = () => true;
    expect(isAdminMiddleware(req, res, next)).toBe(true);
  });

  it('return error for not admin users', () => {
    const req = { auth: {} };
    const res = {
      status: status => ({
        status,
        json: body => ({
          status,
          body,
        }),
      }),
    };
    const next = () => true;

    const { status, body } = isAdminMiddleware(req, res, next);
    expect(status).toBe(401);
    expect(body).toHaveProperty('error', 'Not permited, only for admins.');
  });

  it('return error for not authenticated users', () => {
    const req = {};
    const res = {
      status: status => ({
        status,
        json: body => ({
          status,
          body,
        }),
      }),
    };
    const next = () => true;

    const { status, body } = isAdminMiddleware(req, res, next);
    expect(status).toBe(401);
    expect(body).toHaveProperty('error', 'Not permited, only for admins.');
  });
});
