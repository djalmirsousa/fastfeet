import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Container } from './styles';

function Problem({
  problem: {
    description,
    Delivery: { product },
  },
}) {
  return (
    <Container>
      <span>Produto: {product}</span>
      <div>
        <span>{description}</span>
      </div>
    </Container>
  );
}

Problem.propTypes = {
  problem: PropTypes.shape({
    description: PropTypes.string.isRequired,
    Delivery: PropTypes.shape({ product: PropTypes.string.isRequired })
      .isRequired,
  }).isRequired,
};

export default memo(Problem);
