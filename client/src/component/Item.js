import styled from "styled-components";

const Item = styled.div`
  border-bottom: 1px solid #d9d9d9;
  padding: 8px;
  cursor: pointer;
  &:last-child {
    border: none;
  }
`;

export default Item;
