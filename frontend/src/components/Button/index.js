import React, { memo } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';

import colors from '~/styles/colors';

const Button = styled.button.attrs(props => ({
  children: props.icon ? (
    <>
      <div>{props.icon()}</div>
      <span>{props.children}</span>
    </>
  ) : (
    props.children
  ),
}))`
  display: flex;
  align-items: center;

  padding: 0 16px;
  background-color: ${props => (props.color ? props.color : colors.primary)};
  color: ${props => (props.textColor ? props.textColor : colors.second)};
  border-radius: 4px;
  border: none;
  font-weight: bold;
  font-size: 14px;
  height: 40px;

  &:hover {
    background: ${props =>
      darken(0.03, props.color ? props.color : colors.primary)};
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;

    svg {
      color: ${props => (props.iconColor ? props.iconColor : colors.white)};
      font-size: 24px;
    }
  }
`;

export default memo(Button);
