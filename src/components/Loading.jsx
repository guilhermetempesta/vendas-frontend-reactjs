import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';

const StyledDiv = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  // background: rgb(230,230,230);
`;

const Paragraph = styled.p`
  color: rgba(25, 118, 210, 1);
  font-weight: bold;
`;

export default function Loading() {
  return (
    <StyledDiv>
      <CircularProgress />
      <Paragraph>Carregando...</Paragraph>
    </StyledDiv>
  );
}