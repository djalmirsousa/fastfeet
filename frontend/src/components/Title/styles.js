import styled from 'styled-components';

import colors from '~/styles/colors';

export const StyledTitle = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: right;
  width: 100%;

  h1 {
    font-size: 24px;
    color: ${colors.fontDark};
    margin-bottom: 30px;
  }

  > div {
    display: flex;
    width: 100%;
    align-items: flex-end;
    justify-content: space-between;

    form {
      display: flex;
      flex-direction: row;
      position: relative;

      button {
        height: 40px;
        background: none;
        border: 0;
        position: absolute;
        svg {
          margin: 10px;
          font-size: 20px;
        }
      }

      input {
        padding-left: 35px;
      }
    }
  }
`;
