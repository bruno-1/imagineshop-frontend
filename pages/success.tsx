import styled from "styled-components"
import { Container } from "../styles/utils";

const Main = styled.main`
  ${Container};
  min-height: 589px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Success() {
  return (
    <Main>
      <span>Compra realizada com sucesso.</span>
    </Main>
  )
}