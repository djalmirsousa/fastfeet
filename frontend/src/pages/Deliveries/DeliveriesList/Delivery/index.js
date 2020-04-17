import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import pt from 'date-fns/locale/pt';
import { format } from 'date-fns';

import {
  Container,
  AdressContainer,
  DatesContainer,
  SignatureContainer,
} from './styles';

function Delivery({
  delivery: { start_date, end_date, Recipient, signature },
}) {
  const formatedStartDate = useMemo(
    () =>
      start_date &&
      format(new Date(start_date), "dd'/'MM'/'y", {
        locale: pt,
      }),
    [start_date]
  );

  const formatedEndDate = useMemo(
    () =>
      end_date &&
      format(new Date(end_date), "dd'/'MM'/'y", {
        locale: pt,
      }),
    [end_date]
  );

  return (
    <Container>
      {Recipient && (
        <AdressContainer>
          <span>
            {Recipient.street}, {Recipient.number}
          </span>
          <span>
            {Recipient.city} - {Recipient.state}
          </span>
          <span>{Recipient.zip}</span>
        </AdressContainer>
      )}

      <hr />
      <DatesContainer>
        <span>
          <strong>Retirada: </strong>
          {formatedStartDate}
        </span>
        <span>
          <strong>Entrega: </strong>
          {formatedEndDate}
        </span>
      </DatesContainer>
      <hr />
      <SignatureContainer>
        <strong>Assinatura do destinatário</strong>
        {signature && signature.url && Recipient && (
          <img src={signature.url} alt={`${Recipient.name} signature`} />
        )}
      </SignatureContainer>
    </Container>
  );
}

Delivery.propTypes = {
  delivery: PropTypes.shape({
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    Recipient: PropTypes.shape({
      name: PropTypes.string,
      street: PropTypes.string,
      number: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
    }),
    signature: PropTypes.shape({ url: PropTypes.string }),
  }).isRequired,
};

export default memo(Delivery);
