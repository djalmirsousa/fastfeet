import styled from 'styled-components';
import { Form as Unform } from '@unform/web';

import colors from '~/styles/colors';

export const Form = styled(Unform)`
  background-color: ${colors.second};
  padding: 30px;
  border-radius: 4px;

  input {
    font-size: 21px;
    height: 45px;
    margin-bottom: 15px;
  }
`;
