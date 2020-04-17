import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { MdKeyboardArrowLeft, MdDone } from 'react-icons/md';
import { Form } from '@unform/web';
import { ValidationError } from 'yup';
import api from '~/services/api';
import history from '~/services/history';

import schema from './validator';

import Button from '~/components/Button';
import colors from '~/styles/colors';
import { Input, AsyncSelect } from '~/components/Form';
import LoadingLine from '~/components/LoadingLine';

import { TitleContainer, Content } from './styles';

export default function DeliveryForm({ match }) {
  const formRef = useRef(null);
  const { id } = match.params;
  const [loading, setLoading] = useState(false);

  const [selectedRecipient, setSelectedRecipient] = useState({
    value: 0,
    label: '',
  });

  const [selectedDeliveryman, setSelectedDeliveryman] = useState({
    value: 0,
    label: '',
  });

  useEffect(() => {
    if (id) {
      const getData = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/deliveries/${id}`);
          setLoading(false);
          if (!response.data) {
            toast.error('Entrega inexistente.');
            history.push('/deliveries');
            return;
          }
          // console.log(response.data);
          formRef.current.setData({
            product: response.data.product,
          });

          if (response.data.recipient_id) {
            setSelectedRecipient({
              value: response.data.recipient_id,
              label: response.data.Recipient.name,
            });
          }

          setSelectedDeliveryman({
            value: response.data.deliveryman_id,
            label: response.data.Deliveryman.name,
          });

          setLoading(false);
        } catch (err) {
          toast.error('Não foi possível carregar a Entrega.');
          setLoading(false);
          history.push('/deliveries');
        }
      };
      getData();
    }
  }, [id]);

  const handleSubmit = useCallback(
    async data => {
      try {
        setLoading(true);
        const { value: deliveryman_id } = selectedDeliveryman;
        const { value: recipient_id } = selectedRecipient;
        const { product } = data;

        await schema.validate(
          {
            product,
            recipient_id,
            deliveryman_id,
          },
          {
            abortEarly: false,
          }
        );

        const method = id ? api.put : api.post;

        await method(`/deliveries/${id || ''}`, {
          product,
          recipient_id,
          deliveryman_id,
        });

        formRef.current.setErrors([]);
        toast.success(`Entrega ${id ? 'editado' : 'cadastrado'} com sucesso.`);
        setLoading(false);
        history.push('/deliveries');
      } catch (err) {
        const validationErrors = {};
        if (err instanceof ValidationError) {
          err.inner.forEach(error => {
            validationErrors[error.path] = error.message;
          });
          formRef.current.setErrors(validationErrors);
        } else {
          toast.error(
            `Não foi possível ${id ? 'editar' : 'cadastrar'} a entrega.`
          );
        }

        setLoading(false);
      }
    },
    [id, selectedDeliveryman, selectedRecipient]
  );

  const getRecipientOptions = useCallback(async inputValue => {
    const {
      data: { data },
    } = await api.get('/recipients', {
      params: {
        q: inputValue,
      },
    });

    return [
      { value: null, label: '' },
      ...data.map(d => ({ value: d.id, label: d.name })),
    ];
  }, []);

  const getDeliverymanOptions = useCallback(async inputValue => {
    const {
      data: { data },
    } = await api.get('/deliverymen', {
      params: {
        q: inputValue,
      },
    });

    return [
      { value: null, label: '' },
      ...data.map(d => ({ value: d.id, label: d.name })),
    ];
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>{id ? 'Edição' : 'Cadastro'} de entregas</h1>
        <div>
          <Link to="/deliveries">
            <Button color={colors.grey} icon={MdKeyboardArrowLeft}>
              VOLTAR
            </Button>
          </Link>

          <Button type="submit" form="deliveryForm" icon={MdDone}>
            SALVAR
          </Button>
        </div>
      </TitleContainer>
      <Content>
        {loading && <LoadingLine />}
        <Form ref={formRef} id="deliveryForm" onSubmit={handleSubmit}>
          <AsyncSelect
            noOptionsMessage={() => 'Não há Destinatários'}
            disabled={loading}
            label="Destinatário"
            name="recipient_id"
            type="text"
            loadOptions={getRecipientOptions}
            value={selectedRecipient}
            onChange={setSelectedRecipient}
          />

          <AsyncSelect
            noOptionsMessage={() => 'Não há Entregadores'}
            disabled={loading}
            label="Entregador"
            name="deliveryman_id"
            type="text"
            loadOptions={getDeliverymanOptions}
            value={selectedDeliveryman}
            onChange={setSelectedDeliveryman}
          />

          <Input
            disabled={loading}
            label="Nome do produto"
            name="product"
            type="text"
            placeholder="Digite o nome do produto"
          />
        </Form>
      </Content>
    </>
  );
}

DeliveryForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

DeliveryForm.defaultProps = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: null,
    }),
  }),
};
