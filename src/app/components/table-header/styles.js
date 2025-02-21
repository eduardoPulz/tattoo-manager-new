import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

export const Title = styled.h2`
  font-family: Ubuntu, sans-serif;
  font-size: 20px;
  color: #010101;
  margin: 0;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.columns}, 1fr)`};
  padding: 16px 24px;
  gap: 16px;
  color: black;
`;

export const HeaderCell = styled.div`
  font-family: Ubuntu, sans-serif;
  font-size: 14px;
  text-transform: capitalize;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;