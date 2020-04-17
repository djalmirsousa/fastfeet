import styled from 'styled-components';
import { darken } from 'polished';

import ActionDropdown from './Dropdown';

import colors from '~/styles/colors';

const Table = styled.table`
  width: 100%;
  text-align: left;

  border-collapse: separate;
  border-spacing: 0 1.5em;

  tr {
    color: ${colors.fontColor};
    font-size: 16px;
    line-height: 20px;

    td:first-child,
    th:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    td:last-child,
    th:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  tbody tr {
    background-color: ${colors.second};
    box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.2);

    &:hover {
      background: ${darken(0.04, colors.second)};
    }
  }

  thead tr th:last-child {
    text-align: right;
  }

  tbody tr td:last-child {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  th {
    color: ${colors.fontDark};
  }

  td,
  th {
    padding: 14px;
  }
`;

export { ActionDropdown };

export default Table;
