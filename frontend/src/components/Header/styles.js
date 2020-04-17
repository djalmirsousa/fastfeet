import React from 'react';
import styled from 'styled-components';

import { NavLink } from 'react-router-dom';
import logo from '~/assets/logo.png';

import colors from '~/styles/colors';

export const Container = styled.div`
  height: 64px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid ${colors.border};
  background-color: ${colors.second};
  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.2);
  padding: 20px;
`;

export const Logo = styled.div.attrs(props => ({
  children: (
    <NavLink to={props.to}>
      <img src={logo} alt="FastFeet" />
    </NavLink>
  ),
}))`
  img {
    height: 26px;
  }
  padding: 0px 30px;
  border-right: 1px solid ${colors.border};
`;

export const Perfil = styled.aside`
  width: 100;
  height: 100%;
  padding: 0px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  strong {
    font-size: 14px;
    color: ${colors.fontColor};
  }

  button {
    margin-top: 5px;
    width: 100%;
    background: none;
    border: none;
    text-align: right;
    font-size: 14px;
    color: ${colors.red};
  }
`;

export const Menu = styled.nav`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;

  a {
    background: none;
    border: none;
    text-align: left;
    font-size: 15px;
    font-weight: bold;
    margin: 0px 30px;
    height: 100%;
  }
`;

export const NavButton = styled(NavLink)`
  color: ${props => (props.selected ? colors.fontDark : colors.fontLigh)};
`;
