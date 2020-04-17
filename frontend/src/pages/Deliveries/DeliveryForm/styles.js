import styled from 'styled-components';

import colors from '~/styles/colors';

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;

  h1 {
    color: ${colors.fontDark};
  }

  > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    button {
      margin-left: 16px;
    }
  }
`;

export const Content = styled.div`
  background-color: ${colors.second};
  padding: 30px;
  border-radius: 4px;

  input {
    font-size: 21px;
    height: 45px;
    margin-bottom: 15px;
  }

  form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 15px;
    grid-row-gap: 20px;

    div:nth-child(1) {
      grid-column: 1/2;
    }

    div:nth-child(2) {
      grid-column: 2/3;
    }

    div:nth-child(3) {
      grid-column: 1/3;
    }
  }
`;
