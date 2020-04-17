import styled from 'styled-components';

import DialogTitle from '@material-ui/core/DialogTitle';

import colors from '~/styles/colors';

export const Title = styled(DialogTitle)`
  color: ${colors.fontDark};
  background-color: ${colors.bg};
  > h2 {
    font-size: 14px;
    font-weight: bold;
  }
`;
