import './bootstrap';

import express from 'express';
import 'express-async-errors';

import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

import path from 'path';
import * as Sentry from '@sentry/node';
import routes from './routes';

import sentryConfig from '../Config/sentry';
import ExceptionHandler from '../App/Exceptions/Handler';

import '../Database';

class App {
  constructor() {
    this.server = express();

    if (process.NODE_ENV === 'production') {
      Sentry.init(sentryConfig);
    }

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    if (process.NODE_ENV === 'production') {
      this.server.use(Sentry.Handlers.requestHandler());
    }

    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
    );

    if (process.env.NODE_ENV === 'production') {
      this.server.use(
        new RateLimit({
          store: new RedisStore({
            client: redis.createClient({
              host: process.env.REDIS_HOST,
              port: process.env.REDIS_PORT,
            }),
          }),
          windowMs: 1000 * 60 * 15,
          max: 100,
        })
      );
    }
  }

  routes() {
    this.server.use(routes);
    if (process.NODE_ENV === 'production') {
      this.server.use(Sentry.Handlers.errorHandler());
    }
  }

  exceptionHandler() {
    this.server.use(ExceptionHandler);
  }
}

export default new App().server;
