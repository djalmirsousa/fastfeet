/* eslint-disable no-undef */

import parseMiddleware from '../../../src/App/Middlewares/parseEmptyBodyToNull';

describe('Parse Empty Body To Null Middleware', () => {
  it('Should be parse empty body to null', () => {
    const req = {
      body: {},
    };
    const res = {};
    const next = () => true;
    expect(parseMiddleware(req, res, next)).toBe(true);
    expect(req.body).toBe(null);
  });

  it('Should not be parse not empty body to null', () => {
    const req = {
      body: { teste: 'teste' },
    };
    const res = {};
    const next = () => true;
    expect(parseMiddleware(req, res, next)).toBe(true);
    expect(req.body).toHaveProperty('teste', 'teste');
  });
});
