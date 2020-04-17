import * as Yup from 'yup';

export default Yup.object().shape({
  name: Yup.string()
    .max(255, 'Nome pode ter no máximo 255 caracteres')
    .required('Nome é obrigatório'),
  street: Yup.string()
    .max(255, 'A rua deve ter no máximo 255 caracteres')
    .required('A rua é obrigatória'),
  number: Yup.string().required('O número é obrigatório'),
  complement: Yup.string('O complemento deve ser um texto.').required(
    'O complemeneto é obrigatório'
  ),
  city: Yup.string()
    .max(255, 'A cidade deve ter no máximo 255 caracteres')
    .required('A cidade é obrigatória'),
  state: Yup.string()
    .max(255, 'O estado deve ter no máximo 255 caracteres')
    .required('O estado é obrigatórip'),
  zip: Yup.string()
    .matches(/[0-9]{5}-[\d]{3}/, 'CEP inválido.')
    .required('O CEP é obrigatório.'),
});
