import styled from 'styled-components';
import colors from '~/styles/colors';

export const Wrapper = styled.div`
  background: ${colors.bg};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Container = styled.div`
  max-width: 1366px;
  width: 100%;
  background: none;
  padding: 30px;
`;
