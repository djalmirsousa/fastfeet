import styled from 'styled-components';
import { darken } from 'polished';
import colors from '~/styles/colors';

export const Wrapper = styled.div`
  height: 100vh;
  background: ${colors.primary};

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 315px;
  text-align: center;

  button {
    margin: 5px 0 0;
    height: 44px;
    background: ${colors.primary};
    font-weight: bold;
    border: 0;
    color: ${colors.second};
    border-radius: 4px;
    font-size: 16px;
    transition: background 0.2s;

    &:hover {
      background: ${darken(0.03, colors.primary)};
    }
  }
  a {
    color: ${colors.second};
    margin-top: 5px;
    font-size: 16px;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
`;
