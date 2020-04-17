import { parseISO } from 'date-fns';
import Mail from '../../Lib/mail';

class DeliveryCancelledMail {
  get key() {
    return 'DeliveryCancelledMail';
  }

  async handle({ data: { problem } }) {
    const { Delivery } = problem;
    const { Deliveryman, Recipient } = Delivery;
    problem.updatedAt = parseISO(problem.updatedAt).toString();
    if (Deliveryman) {
      await Mail.sendMail({
        to: `${Deliveryman.name} <${Deliveryman.email}>`,
        subject: 'Entrega Cancelada',
        template: 'deliveryCancelled',
        context: {
          interested: Deliveryman,
          recipient: Recipient,
          delivery: Delivery,
          problem,
        },
      });
    }

    if (Recipient) {
      await Mail.sendMail({
        to: `${Recipient.name} <${Recipient.email}>`,
        subject: 'Entrega Cancelada',
        template: 'deliveryCancelled',
        context: {
          interested: Recipient,
          recipient: Recipient,
          delivery: Delivery,
          problem,
        },
      });
    }
  }
}

export default new DeliveryCancelledMail();
