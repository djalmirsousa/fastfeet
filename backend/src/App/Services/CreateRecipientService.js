import Recipient from '../Models/Recipient';

export default {
  async run({ name, street, number, complement, state, city, zip }) {
    return Recipient.create({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip,
    });
  },
};
