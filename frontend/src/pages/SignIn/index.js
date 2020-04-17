import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { Container, Img, SignInput, SignForm } from './styles';
import logo from '~/assets/logo.png';

import { signInRequest } from '~/store/modules/auth/actions';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é Obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export default function SignIn() {
  const dispath = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  const handleSubmit = useCallback(
    ({ email, password }) => dispath(signInRequest(email, password)),
    [dispath]
  );

  return (
    <Container>
      <Img src={logo} alt="FastFeet" />

      <SignForm schema={schema} onSubmit={handleSubmit} loading={loading}>
        <SignInput
          label="SEU E-MAIL"
          name="email"
          type="email"
          placeholder="exemplo@email.com"
        />

        <SignInput
          label="SUA SENHA"
          name="password"
          type="password"
          placeholder="************"
        />

        <button type="submit">
          {loading ? 'Carregando...' : 'Entrar no sistema'}
        </button>
      </SignForm>
    </Container>
  );
}
