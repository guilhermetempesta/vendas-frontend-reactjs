import * as React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

const TitleDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: rgb(25,118,210);
`;

function Title(props) {
  return (
    <TitleDiv>
      {props.children}
    </TitleDiv>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};

export default Title;