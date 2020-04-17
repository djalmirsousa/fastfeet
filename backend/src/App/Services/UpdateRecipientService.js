import Recipient from '../Models/Recipient';
import Exception from '../Exceptions/ServiceException';

export default {
  async run(
    { recipientId: id },
    { name, street, number, complement, state, city, zip }
  ) {
    const dialectIsProtgres = process.env.DB_DIALECT === 'postgres';
    const result = await Recipient.update(
      {
        name,
        street,
        number,
        complement,
        state,
        city,
        zip,
      },
      { where: { id }, returning: dialectIsProtgres }
    );

    if (result[0] < 1) {
      throw new Exception('Invalid Recipient id.');
    }

    if (!dialectIsProtgres) {
      return Recipient.findByPk(id);
    }

    return result[1][0];
  },
};
