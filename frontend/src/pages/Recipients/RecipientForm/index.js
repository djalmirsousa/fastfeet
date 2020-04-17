import React, { useCallback, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdKeyboardArrowLeft, MdDone } from 'react-icons/md';
import { Form } from '@unform/web';
import { ValidationError } from 'yup';
import api from '~/services/api';
import history from '~/services/history';

import schema from './validator';

import Button from '~/components/Button';
import colors from '~/styles/colors';
import { Input, InputMask } from '~/components/Form';
import LoadingLine from '~/components/LoadingLine';

import { TitleContainer, Content } from './styles';

export default function RecipientForm({ match }) {
  const formRef = useRef(null);
  const { id } = match.params;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const getData = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/recipients/${id}`);
          if (!response.data) {
            toast.error('Destinatário inexistente.');
            history.push('/recipients');
          }

          formRef.current.setData(response.data);
          setLoading(false);
          // setInitialData(response.data);
        } catch (err) {
          toast.error('Não foi possível carregar o Destinatário.');
          setLoading(false);
          history.push('/recipients');
        }
      };
      getData();
    }
  }, [id]);

  const handleSubmit = useCallback(
    async data => {
      try {
        setLoading(true);
        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, street, number, complement, city, state, zip } = data;
        const method = id ? api.put : api.post;

        await method(`/recipients/${id || ''}`, {
          name,
          street,
          number,
          complement,
          city,
          state,
          zip,
        });

        toast.success(
          `Destinatário ${id ? 'editado' : 'cadastrado'} com sucesso.`
        );
        setLoading(false);

        history.push('/recipients');
      } catch (err) {
        const validationErrors = {};
        if (err instanceof ValidationError) {
          err.inner.forEach(error => {
            validationErrors[error.path] = error.message;
          });
          formRef.current.setErrors(validationErrors);
        } else {
          toast.error(
            `Não foi possível ${id ? 'editar' : 'cadastrar'} o destinatário.`
          );
        }

        setLoading(false);
      }
    },
    [id]
  );
  return (
    <>
      <TitleContainer>
        <h1>{id ? 'Edição' : 'Cadastro'} de destinatário</h1>
        <div>
          <Link to="/recipients">
            <Button color={colors.grey} icon={MdKeyboardArrowLeft}>
              VOLTAR
            </Button>
          </Link>

          <Button type="submit" form="recipientForm" icon={MdDone}>
            SALVAR
          </Button>
        </div>
      </TitleContainer>
      <Content>
        {loading && <LoadingLine />}
        <Form ref={formRef} id="recipientForm" onSubmit={handleSubmit}>
          <Input
            disabled={loading}
            label="Nome"
            name="name"
            type="text"
            placeholder="Digite o nome completo"
          />

          <Input
            disabled={loading}
            label="Rua"
            name="street"
            type="text"
            placeholder="Digite a rua"
          />

          <Input
            disabled={loading}
            label="Número"
            name="number"
            type="number"
            placeholder="Digite o número"
            min="0"
          />

          <Input
            disabled={loading}
            label="Complemento"
            name="complement"
            type="text"
          />

          <Input disabled={loading} label="Cidade" name="city" type="text" />

          <Input disabled={loading} label="Estado" name="state" type="text" />

          <InputMask
            disabled={loading}
            label="CEP"
            name="zip"
            id="zip"
            type="text"
            placeholder="00000-000"
            mask="99999-999"
          />
        </Form>
      </Content>
    </>
  );
}

RecipientForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

RecipientForm.defaultProps = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: null,
    }),
  }),
};
