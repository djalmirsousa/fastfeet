import styled from 'styled-components';

import { Form } from '@unform/web';
import { Input } from '~/components/Form';

import colors from '~/styles/colors';

export const StyledPagination = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 8px;

  border-radius: 4px;
  width: 100%;

  button {
    background: none;
    border: 0;
    > svg {
      font-size: 24px;
      color: ${colors.fontDark};
    }
    margin: 0 8px;
  }

  input {
    background-color: ${colors.second}d;
    border: 1px solid ${colors.border};
    border-radius: 20px;
    padding: 0 0 0 35px;
    height: 24px;

    &::placeholder {
      color: ${colors.fontDark};
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      opacity: 1;
    }
  }
`;

export const StyledInput = styled(Input)``;
export const StyledForm = styled(Form)``;
