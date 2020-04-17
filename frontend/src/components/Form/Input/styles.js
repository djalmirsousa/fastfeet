import styled from 'styled-components';
import colors from '~/styles/colors';

export const Label = styled.label`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: ${colors.label};
  text-align: left;
  margin-bottom: 10px;
  display: flex;
`;

export const Input = styled.input`
  background: rgba(255, 255, 255, 1);
  border: 1px solid ${colors.border};
  border-radius: 4px;
  height: 40px;
  padding: 0 15px;
  color: ${colors.fontDark};
  /* margin: 0 0 15px; */
  width: 100%;
`;

export const Error = styled.span`
  color: ${colors.red};
`;
