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
  height: 100%;

  max-height: 60vh;
  max-width: 60vh;

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    padding: 10px 0;
  }

  span {
    margin: 4px 0;
    color: ${colors.fontColor};
  }

  strong {
    color: ${colors.fontDark};
  }
`;

export const AdressContainer = styled.div``;

export const DatesContainer = styled.div``;

export const SignatureContainer = styled.div`
  img {
    max-width: 450px;
    max-height: 250px;
    height: 100%;
    width: 100%;

    padding: 40px;
    background: none;
    margin: 0;
  }
`;
