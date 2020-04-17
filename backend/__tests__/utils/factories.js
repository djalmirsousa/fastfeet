import { factory } from 'factory-girl';

import User from '../../src/App/Models/User';
import Deliveryman from '../../src/App/Models/Deliveryman';
import Recipient from '../../src/App/Models/Recipient';
import Admin from '../../src/App/Models/Admin';
import Delivery from '../../src/App/Models/Delivery';
import File from '../../src/App/Models/File';
import Problem from '../../src/App/Models/Problem';

import faker from './faker';

factory.define('User', User, () => ({
  name: faker.name(),
  email: faker.email(),
  password: faker.string({ length: 50 }),
}));

factory.define('Admin', Admin, () => ({
  user_id: factory.assoc('User', 'id'),
}));

factory.define('Recipient', Recipient, () => ({
  name: faker.name(),
  street: faker.street({ country: 'it' }),
  city: faker.city(),
  number: faker.integer({ min: 1 }),
  complement: faker.sentence(),
  state: faker.state(),
  zip: '36520-000',
}));

factory.define('Deliveryman', Deliveryman, () => ({
  name: faker.name(),
  email: faker.email(),
  // avatar_id: factory.assoc('File', 'id'),
}));

factory.define('Delivery', Delivery, () => ({
  deliveryman_id: factory.assoc('Deliveryman', 'id'),
  recipient_id: factory.assoc('Recipient', 'id'),
  signature_id: null,
  product: faker.string(),
  start_date: null,
  end_date: null,
  canceled_at: null,
}));

// factory.define('File', File, () => ({
//   name: `${faker.string({ length: 50 })}.png`,
//   path: `${faker.string({ length: 50 })}.png`,
// }));

factory.define('Problem', Problem, () => ({
  description: faker.string({
    length: faker.integer({ min: 10, max: 1000 }),
  }),
  delivery_id: factory.assoc('Delivery', 'id'),
}));

factory.randomIteger = faker.integer;

export default factory;
