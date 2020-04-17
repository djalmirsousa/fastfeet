import React, { useCallback, useEffect, useState, createContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdCreate, MdDeleteForever } from 'react-icons/md';
import { confirmAlert } from 'react-confirm-alert';

import api from '~/services/api';

import LoadingLine from '~/components/LoadingLine';
import Title from '~/components/Title';
import Pagination from '~/components/Pagination';
import Button from '~/components/Button';
import Table, { ActionDropdown } from '~/components/Table';
import ConfirmAlert from '~/components/ConfirmAlert';

import { Avatar } from './styles';

import colors from '~/styles/colors';

const PageContext = createContext(null);

export default function DeliverymenList() {
  const [loading, setLoading] = useState(false);
  const [deliverymen, setDeliverymen] = useState([]);
  const [page, setPage] = useState(1);
  const [pageAmount, setPageAmount] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const {
          data: { data, totalPages },
        } = await api.get('/deliverymen', {
          params: {
            page,
            quantity: 20,
            scope: ['deliveryList'],
            q: search,
          },
        });
        setDeliverymen(data);
        setPageAmount(totalPages);
      } catch (err) {
        toast.error('Não foi possível carregar os entregadores.');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [page, search]);

  const handleSearchSubmit = useCallback(data => {
    setPage(1);
    setSearch(data.search);
  }, []);

  const handleDelete = useCallback(
    deliveryman => {
      const deleteDeliveryman = async setDeli => {
        try {
          await api.delete(`/deliverymen/${deliveryman.id}`);

          toast.success('Entregador deletado com sucesso.');

          setDeli(
            deliverymen.filter(
              currentDeliveryman => currentDeliveryman.id !== deliveryman.id
            )
          );
        } catch (error) {
          toast.error('Não foi possível excluir este entregador.');
        }
      };

      confirmAlert({
        customUI: ({ onClose }) => ( // eslint-disable-line
          <ConfirmAlert
            callback={() => deleteDeliveryman(setDeliverymen)}
            onClose={onClose}
            title="Deseja excluir esta entrega?"
            message={
              <>
                <p>
                  <strong>nome: </strong> {deliveryman.name}
                </p>
                <p>
                  <strong>email: </strong> {deliveryman.email}
                </p>
                <p>
                  Se confirmar, o entregador <strong>{deliveryman.id}</strong>{' '}
                  será deletado. Isso é irreversível. Deseja mesmo excluí-lo?
                </p>
              </>
            }
          />
        ),
      });
    },
    [deliverymen]
  );

  return (
    <PageContext.Provider
      value={{
        page: [page, setPage],
        pageAmount: [pageAmount, setPageAmount],
        loading,
      }}
    >
      <Title
        title="Gerenciando entregadores"
        handleSearchSubmit={handleSearchSubmit}
        buttonLink="deliverymen/create"
        loading={loading}
      />
      <Pagination context={PageContext} />
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Foto</th>
            <th>Nome</th>
            <th>Email</th>
            <th style={{ width: '100px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td>
                <LoadingLine />
              </td>
              <td>
                <LoadingLine />
              </td>
              <td>
                <LoadingLine />
              </td>
              <td>
                <LoadingLine />
              </td>
              <td>
                <LoadingLine />
              </td>
            </tr>
          ) : (
            deliverymen.map(deliveryman => (
              <tr key={deliveryman.id}>
                <td>#{deliveryman.id}</td>
                <td>
                  <Avatar
                    src={
                      deliveryman.avatar_url
                        ? deliveryman.avatar_url
                        : 'https://api.adorable.io/avatars/50/abott@adorable.png'
                    }
                    alt={deliveryman.name}
                  />
                </td>
                <td>{deliveryman.name}</td>
                <td>{deliveryman.email}</td>
                <td>
                  <ActionDropdown>
                    <ul>
                      <li>
                        <Link to={`/deliverymen/${deliveryman.id}`}>
                          <Button
                            icon={MdCreate}
                            color="transparent"
                            textColor={colors.fontLigh}
                            iconColor={colors.blue}
                            type="button"
                          >
                            Editar
                          </Button>
                        </Link>
                      </li>
                      <li>
                        <Button
                          icon={MdDeleteForever}
                          color="transparent"
                          textColor={colors.fontLigh}
                          iconColor={colors.red}
                          type="button"
                          onClick={() => handleDelete(deliveryman)}
                        >
                          Excluir
                        </Button>
                      </li>
                    </ul>
                  </ActionDropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </PageContext.Provider>
  );
}
