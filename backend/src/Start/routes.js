import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import multer from 'multer';
import multerConfig from '../Config/multer';

import authMiddleware from '../App/Middlewares/auth';
import isAdminMiddleware from '../App/Middlewares/isAdmin';
import parseEmptyBodyToNull from '../App/Middlewares/parseEmptyBodyToNull';

import RouteParamsIdValidator from '../App/Validators/RouteParamsIdValidator';
import UserStoreValidator from '../App/Validators/UserStoreValidator';
import UserUpdateValidator from '../App/Validators/UserUpdateValidator';
import DeliverymanStoreValidator from '../App/Validators/DeliverymanStoreValidator';
import DeliverymanUpdateValidator from '../App/Validators/DeliverymanUpdateValidator';
import SessionStoreValidator from '../App/Validators/SessionStoreValidator';
import RecipientStoreValidator from '../App/Validators/RecipientStoreValidator';
import RecipientUpdateValidator from '../App/Validators/RecipientUpdateValidator';
import DeliveryStoreValidator from '../App/Validators/DeliveryStoreValidator';
import DeliveryUpdateValidator from '../App/Validators/DeliveryUpdateValidator';
import DeliveryWithdrawValidator from '../App/Validators/DeliveryWithdrawValidator';
import ProblemStoreValidator from '../App/Validators/ProblemStoreValidator';

import UserController from '../App/Controllers/UserController';
import DeliverymanController from '../App/Controllers/DeliverymanController';
import SessionController from '../App/Controllers/SessionController';
import RecipientsController from '../App/Controllers/RecipientsController';
import DeliveryController from '../App/Controllers/DeliveryController';
import FileController from '../App/Controllers/FileController';
import ProblemController from '../App/Controllers/ProblemController';

import FakeDataController from '../App/Controllers/FakeDataController';

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore =
  process.env.NODE_env === 'production'
    ? new BruteRedis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      })
    : null;

const bruteForce =
  process.env.NODE_env === 'production'
    ? new Brute(bruteStore)
    : { prevent: (req, res, next) => next() };

routes.use(parseEmptyBodyToNull);

routes.get('/fake', FakeDataController.index);

routes.post(
  '/users',
  bruteForce.prevent,
  UserStoreValidator,
  UserController.store
);
routes.post(
  '/sessions',
  bruteForce.prevent,
  SessionStoreValidator,
  SessionController.store
);

routes.get(
  '/deliverymen/:deliverymanId/deliveries',
  RouteParamsIdValidator(['deliverymanId']),
  DeliveryController.index
);

routes.post(
  '/deliverymen/:deliverymanId/deliveries/:deliveryId/withdraw',
  RouteParamsIdValidator(['deliverymanId', 'deliveryId']),
  DeliveryWithdrawValidator,
  DeliveryController.update
);

routes.post(
  '/deliverymen/:deliverymanId/deliveries/:deliveryId/finish',
  RouteParamsIdValidator(['deliverymanId', 'deliveryId']),
  upload.single('file'),
  FileController.store,
  DeliveryController.update
);

routes.post(
  '/deliveries/:deliveryId/problems',
  RouteParamsIdValidator(['deliveryId']),
  ProblemStoreValidator,
  ProblemController.store
);

routes.use(authMiddleware);

routes.put(
  '/users/:userId',
  RouteParamsIdValidator(['userId']),
  UserUpdateValidator,
  UserController.update
);

routes.get('/problems', isAdminMiddleware, ProblemController.index);
routes.get(
  '/deliveries/:deliveryId/problems',
  RouteParamsIdValidator(['deliveryId']),
  isAdminMiddleware,
  ProblemController.index
);

routes.get('/recipients', isAdminMiddleware, RecipientsController.index);
routes.get(
  '/recipients/:recipientId',
  RouteParamsIdValidator(['recipientId']),
  isAdminMiddleware,
  RecipientsController.show
);

routes.post(
  '/recipients',
  isAdminMiddleware,
  RecipientStoreValidator,
  RecipientsController.store
);

routes.put(
  '/recipients/:recipientId',
  isAdminMiddleware,
  RouteParamsIdValidator(['recipientId']),
  RecipientUpdateValidator,
  RecipientsController.update
);

routes.delete(
  '/recipients/:recipientId',
  isAdminMiddleware,
  RouteParamsIdValidator(['recipientId']),
  RecipientsController.delete
);

routes.get('/deliverymen', isAdminMiddleware, DeliverymanController.index);

routes.get(
  '/deliverymen/:deliverymanId',
  isAdminMiddleware,
  RouteParamsIdValidator(['deliverymanId']),
  DeliverymanController.show
);

routes.post(
  '/deliverymen',
  isAdminMiddleware,
  DeliverymanStoreValidator,
  DeliverymanController.store
);

routes.put(
  '/deliverymen/:deliverymanId',
  isAdminMiddleware,
  RouteParamsIdValidator(['deliverymanId']),
  DeliverymanUpdateValidator,
  DeliverymanController.update
);

routes.post(
  '/deliverymen/:deliverymanId/avatar',
  isAdminMiddleware,
  upload.single('file'),
  FileController.store,
  DeliverymanController.update
);

routes.delete(
  '/deliverymen/:deliverymanId',
  isAdminMiddleware,
  RouteParamsIdValidator(['deliverymanId']),
  DeliverymanController.delete
);

routes.get('/deliveries', isAdminMiddleware, DeliveryController.index);
routes.get(
  '/deliveries/:deliveryId',
  isAdminMiddleware,
  RouteParamsIdValidator(['deliveryId']),
  DeliveryController.show
);

routes.post(
  '/deliveries',
  isAdminMiddleware,
  DeliveryStoreValidator,
  DeliveryController.store
);

routes.put(
  '/deliveries/:deliveryId',
  isAdminMiddleware,
  RouteParamsIdValidator(['deliveryId']),
  DeliveryUpdateValidator,
  DeliveryController.update
);

routes.delete(
  '/deliveries/:deliveryId',
  isAdminMiddleware,
  RouteParamsIdValidator(['deliveryId']),
  DeliveryController.delete
);

routes.delete(
  '/problems/:problemId/cancel-delivery',
  isAdminMiddleware,
  RouteParamsIdValidator(['problemId']),
  DeliveryController.delete
);

export default routes;
