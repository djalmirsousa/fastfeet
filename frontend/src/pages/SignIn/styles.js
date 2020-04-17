import styled from 'styled-components';
import { Form, Input } from '~/components/Form';

import colors from '~/styles/colors';

export const Container = styled.div`
  background: ${colors.second};
  border-radius: 4px;
  padding: 60px 30px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  width: 360px;
`;

export const Img = styled.img`
  height: 44px;
  margin-bottom: 30px;
`;

export const SignForm = styled(Form)`
  margin: 0;
  padding: 0;
`;

export const SignInput = styled(Input)`
  margin: 0 0 15px;
`;
