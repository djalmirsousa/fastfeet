import styled from 'styled-components';

import { darken } from 'polished';

import colors from '~/styles/colors';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  > div {
    z-index: 1;
    display: none;
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: 28px;

    > div:last-child {
      background-color: ${colors.second};
      box-shadow: 0px 0px 2px #00000026;
      margin-top: 10px;

      padding: 10px;

      li {
        &:hover {
          background: ${darken(0.04, colors.second)};
        }
      }
    }
  }

  &:hover {
    > div {
      display: flex;
    }
  }
`;

export const Arrow = styled.div`
  position: absolute;
  z-index: 1;
  display: inline-block;

  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid ${colors.second};
`;

export const MoreButton = styled.button`
  background: none;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 5px;

  &:hover {
    border: 1px solid ${props => darken(0.1, props.color || colors.second)};
  }
`;
