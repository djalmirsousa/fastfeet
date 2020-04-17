import React, { useCallback, useEffect, useState, createContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdVisibility, MdCreate, MdDeleteForever } from 'react-icons/md';
import { confirmAlert } from 'react-confirm-alert';

import api from '~/services/api';

import 'react-confirm-alert/src/react-confirm-alert.css';

import Title from '~/components/Title';
import Dialog from '~/components/Dialog';
import Pagination from '~/components/Pagination';
import Button from '~/components/Button';
import Table, { ActionDropdown } from '~/components/Table';
import LoadingLine from '~/components/LoadingLine';
import ConfirmAlert from '~/components/ConfirmAlert';

import Delivery from './Delivery';

import colors from '~/styles/colors';

import { Status } from './styles';

const PageContext = createContext(null);

export default function DeliveriesList() {
  const [loading, setLoading] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState({});
  const [page, setPage] = useState(1);
  const [pageAmount, setPageAmount] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchSubmit = useCallback(data => {
    setPage(1);
    setSearch(data.search);
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const {
          data: { data, totalPages },
        } = await api.get('/deliveries', {
          params: {
            page,
            quantity: 20,
            scopes: JSON.stringify(['recipient', 'deliveryman', 'signature']),
            q: search,
          },
        });
        setDeliveries(data);
        setPageAmount(totalPages);
      } catch (err) {
        toast.error('Não foi possível carregar as entregas.');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [page, search]);

  const handleDetails = useCallback(data => {
    setSelectedDelivery(data);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    delivery => {
      const deleteDelivery = async setDeli => {
        try {
          await api.delete(`/deliveries/${delivery.id}`);

          toast.success('Entrega deletada com sucesso.');

          setDeli(
            deliveries.filter(
              currentDelivery => currentDelivery.id !== delivery.id
            )
          );
        } catch (error) {
          toast.error('Não foi possível excluir esta entrega.');
        }
      };

      confirmAlert({
      customUI: ({ onClose }) => ( // eslint-disable-line
          <ConfirmAlert
            callback={() => deleteDelivery(setDeliveries)}
            onClose={onClose}
            title="Deseja excluir esta entrega?"
            message={
              <>
                <p>
                  <strong>ID: </strong>
                  {delivery.id}
                </p>
                <p>
                  <strong>Produto: </strong>
                  {delivery.product}
                </p>
                <p>
                  Se confirmar, a entrega <strong>{delivery.id}</strong> será
                  deletada. Isso é irreversível. Deseja mesmo excluí-la?
                </p>
              </>
            }
          />
        ),
      });
    },
    [deliveries]
  );

  return (
    <PageContext.Provider
      value={{
        page: [page, setPage],
        pageAmount: [pageAmount, setPageAmount],
        loading,
      }}
    >
      <Dialog
        title="Informações da encomenda"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Delivery delivery={selectedDelivery} />
      </Dialog>
      <Title
        title="Gerenciando encomendas"
        handleSearchSubmit={handleSearchSubmit}
        buttonLink="/deliveries/create"
        loading={loading}
      />
      <Pagination context={PageContext} />
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Destinatário</th>
            <th>Produto</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th style={{ width: '120px', textAlign: 'center' }}>Status</th>
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
              <td>
                <LoadingLine />
              </td>
              <td>
                <LoadingLine />
              </td>
            </tr>
          ) : (
            deliveries.map(delivery => (
              <tr key={delivery.id}>
                <td>#{delivery.id}</td>
                <td>{delivery.Recipient ? delivery.Recipient.name : ''}</td>
                <td>{delivery.product}</td>
                <td>{delivery.Recipient ? delivery.Recipient.city : ''}</td>
                <td>{delivery.Recipient ? delivery.Recipient.state : ''}</td>
                <td>
                  <Status>{delivery.status}</Status>
                </td>
                <td>
                  <ActionDropdown>
                    <ul>
                      <li>
                        <Button
                          icon={MdVisibility}
                          color="transparent"
                          textColor={colors.fontLigh}
                          iconColor={colors.primary}
                          type="button"
                          onClick={() => handleDetails(delivery)}
                        >
                          Visualizar
                        </Button>
                      </li>
                      {delivery.status === 'PENDENTE' && (
                        <li>
                          <Link to={`/deliveries/${delivery.id}`}>
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
                      )}

                      {delivery.status === 'PENDENTE' && (
                        <li>
                          <Button
                            icon={MdDeleteForever}
                            color="transparent"
                            textColor={colors.fontLigh}
                            iconColor={colors.red}
                            type="button"
                            onClick={() => handleDelete(delivery)}
                          >
                            Excluir
                          </Button>
                        </li>
                      )}
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
