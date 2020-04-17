import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { MdAdd, MdSearch } from 'react-icons/md';
import { Form } from '@unform/web';
import { Input } from '~/components/Form';

import Button from '~/components/Button';

import { StyledTitle } from './styles';

import colors from '~/styles/colors';

function Title({ title, handleSearchSubmit, buttonLink, loading }) {
  return (
    <StyledTitle>
      <h1>{title}</h1>

      {(handleSearchSubmit || buttonLink) && (
        <div>
          {handleSearchSubmit && (
            <Form onSubmit={handleSearchSubmit}>
              <button type="submit" disabled={loading}>
                <MdSearch color={colors.fontLigh} />
              </button>

              <Input
                type="text"
                name="search"
                placeholder="Buscar por encomendas"
                disabled={loading}
              />
            </Form>
          )}

          {buttonLink && (
            <Link to={buttonLink}>
              <Button icon={MdAdd} type="button">
                CADASTRAR
              </Button>
            </Link>
          )}
        </div>
      )}
    </StyledTitle>
  );
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
  handleSearchSubmit: PropTypes.func,
  buttonLink: PropTypes.string,
  loading: PropTypes.bool,
};

Title.defaultProps = {
  loading: false,
  handleSearchSubmit: null,
  buttonLink: null,
};

export default memo(Title);
