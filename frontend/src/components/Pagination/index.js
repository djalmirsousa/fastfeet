import React, { useContext, memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import {
  MdKeyboardArrowLeft,
  MdFirstPage,
  MdKeyboardArrowRight,
  MdLastPage,
} from 'react-icons/md';

import { StyledPagination, StyledForm, StyledInput } from './styles';

function Pagination({ context }) {
  const {
    page: [page, setPage],
    pageAmount: [pageAmount],
    loading,
  } = useContext(context);

  const [newPage, setNewPage] = useState(1);

  const handlePage = useCallback(
    value => {
      setPage(value);
      setNewPage(value);
    },
    [setPage]
  );

  const handleFirst = useCallback(() => {
    handlePage(1);
  }, [handlePage]);

  const handleLast = useCallback(() => {
    handlePage(pageAmount);
  }, [handlePage, pageAmount]);

  const handleNext = useCallback(() => {
    const next = page + 1;

    if (next < 1 || next > pageAmount) {
      return;
    }
    handlePage(next);
  }, [handlePage, page, pageAmount]);

  const handlePrevious = useCallback(() => {
    const next = page - 1;
    if (next < 1 || next > pageAmount) {
      return;
    }
    handlePage(next);
  }, [handlePage, page, pageAmount]);

  const handleNewPage = useCallback(
    ({ page: p }) => {
      if (p === page || p < 1 || p > pageAmount) {
        return;
      }
      handlePage(p);
    },
    [handlePage, page, pageAmount]
  );

  return (
    <StyledPagination>
      <button type="button" onClick={handleFirst} disabled={loading}>
        <MdFirstPage />
      </button>
      <button type="button" onClick={handlePrevious} disabled={loading}>
        <MdKeyboardArrowLeft />
      </button>
      <StyledForm onSubmit={handleNewPage}>
        <StyledInput
          disabled={loading}
          name="page"
          type="number"
          min="1"
          max={pageAmount}
          value={newPage}
          onChange={e => setNewPage(e.target.value)}
        />
      </StyledForm>
      <button type="button" onClick={handleNext} disabled={loading}>
        <MdKeyboardArrowRight />
      </button>
      <button type="button" onClick={handleLast} disabled={loading}>
        <MdLastPage />
      </button>
    </StyledPagination>
  );
}

Pagination.propTypes = {
  context: PropTypes.shape({
    page: PropTypes.shape([
      PropTypes.number.isRequired,
      PropTypes.func.isRequired,
    ]),
    pageAmount: PropTypes.shape([PropTypes.number.isRequired, PropTypes.func]),
  }).isRequired,
};

export default memo(Pagination);
