import Mail from '../../Lib/mail';

class DeliveryAvailableMail {
  get key() {
    return 'DeliveryAvailableMail';
  }

  async handle({ data: { deliveryman, delivery, recipient } }) {
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova Entrega',
      template: 'deliveryAvailable',
      context: {
        deliveryman,
        recipient,
        delivery,
      },
    });
  }
}

export default new DeliveryAvailableMail();
