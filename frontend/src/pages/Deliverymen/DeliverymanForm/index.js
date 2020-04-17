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
import { Input, ImageInput } from '~/components/Form';
import LoadingLine from '~/components/LoadingLine';

import { TitleContainer, Content } from './styles';

export default function DeliverymanForm({ match }) {
  const formRef = useRef(null);
  const { id } = match.params;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const getData = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/deliverymen/${id}`);
          if (!response.data) {
            toast.error('Entregador inexistente.');
            history.push('/deliverymen');
          }

          formRef.current.setData({
            name: response.data.name,
            email: response.data.email,
            avatar: response.data.avatar_url,
          });
          setLoading(false);
          // setInitialData(response.data);
        } catch (err) {
          toast.error('Não foi possível carregar o Entregador.');
          setLoading(false);
          history.push('/deliverymen');
        }
      };
      getData();
    }
  }, [id]);

  const handleSubmit = useCallback(
    async data => {
      try {
        setLoading(true);
        const { name, email, avatar } = data;

        await schema.validate(
          { name, email },
          {
            abortEarly: false,
          }
        );

        const method = id ? api.put : api.post;

        const { data: deliveryman } = await method(`/deliverymen/${id || ''}`, {
          name,
          email,
        });

        if (avatar) {
          const formData = new FormData();
          formData.append('file', avatar);

          await api.post(`/deliverymen/${deliveryman.id}/avatar`, formData);
        }

        toast.success(
          `Entregador ${id ? 'editado' : 'cadastrado'} com sucesso.`
        );
        setLoading(false);

        history.push('/deliverymen');
      } catch (err) {
        console.log(err);
        const validationErrors = {};
        if (err instanceof ValidationError) {
          err.inner.forEach(error => {
            validationErrors[error.path] = error.message;
          });
          formRef.current.setErrors(validationErrors);
        } else {
          toast.error(
            `Não foi possível ${id ? 'editar' : 'cadastrar'} o entregador.`
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
        <h1>{id ? 'Edição' : 'Cadastro'} de entregador</h1>
        <div>
          <Link to="/deliverymen">
            <Button color={colors.grey} icon={MdKeyboardArrowLeft}>
              VOLTAR
            </Button>
          </Link>

          <Button type="submit" form="deliverymanForm" icon={MdDone}>
            SALVAR
          </Button>
        </div>
      </TitleContainer>
      <Content>
        {loading && <LoadingLine />}
        <Form ref={formRef} id="deliverymanForm" onSubmit={handleSubmit}>
          <ImageInput name="avatar" />
          <Input
            disabled={loading}
            label="Nome"
            name="name"
            type="text"
            placeholder="Digite o nome completo"
          />
          <Input
            disabled={loading}
            label="Email"
            name="email"
            type="email"
            placeholder="Digite o email"
          />
        </Form>
      </Content>
    </>
  );
}

DeliverymanForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

DeliverymanForm.defaultProps = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: null,
    }),
  }),
};
