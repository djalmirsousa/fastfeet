import styled from 'styled-components';

import colors from '~/styles/colors';

export const Error = styled.span`
  color: ${colors.red};
`;

export const Container = styled.div`
  align-self: center;
  margin-bottom: 30px;

  label {
    cursor: pointer;
    min-width: 150px;
    min-height: 150px;
    max-width: 300px;
    max-height: 300px;
    width: 100%;
    height: 100%;

    &:hover {
      opacity: 0.7;
    }

    input {
      display: none;
    }
  }
`;

export const PreviewContainer = styled.div`
  border: 1px dashed ${colors.border};
  border-radius: 100%;

  div {
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  svg {
    color: ${colors.border};
    height: 80px;
    width: 80px;
  }

  span {
    font-size: 16px;
    font-weight: bold;
    color: ${colors.border};
  }
`;

export const Preview = styled.img`
  display: flex;
  min-width: 150px;
  min-height: 150px;
  max-width: 300px;
  max-height: 300px;
  width: 100%;
  height: 100%;
  border: 2px dashed ${colors.primary};
  border-radius: 100%;
  padding: 1px;
`;
