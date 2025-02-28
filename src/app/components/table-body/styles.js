import styled from "styled-components";

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  
  .empty-message {
    padding: 24px;
    text-align: center;
    color: #666;
    font-style: italic;
  }
`;
