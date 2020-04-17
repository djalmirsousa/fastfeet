import styled from 'styled-components';

import colors from '~/styles/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.bg};
  padding: 0 25px 25px 25px;
  border-radius: 4px;

  overflow-wrap: break-word;

  min-width: 300px;
  min-height: 300px;
  width: 100%;

  max-height: 60vh;
  max-width: 60vh;

  span {
    margin: 8px 0;
  }

  div {
    overflow-x: unset;
    overflow-y: auto;
    > span {
      color: ${colors.fontColor};
    }
  }

  strong {
    color: ${colors.fontDark};
  }
`;
