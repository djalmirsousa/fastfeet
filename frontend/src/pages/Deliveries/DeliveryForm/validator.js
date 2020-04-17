import * as Yup from 'yup';

export default Yup.object().shape({
  product: Yup.string()
    .max(255, 'Produto pode ter no máximo 255 caracteres')
    .required('Produto é obrigatório'),
  recipient_id: Yup.number('O destinatário é obrigatório')
    .integer('O destinatário é obrigatório')
    .positive('O destinatário é obrigatório')
    .required('O destinatário é obrigatório'),
  deliveryman_id: Yup.number('O entregador é obrigatório')
    .integer('O entregador é obrigatório')
    .positive('O entregador é obrigatório')
    .required('O entregador é obrigatório'),
});
