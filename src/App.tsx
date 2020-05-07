import * as React from "react";
import styled from "styled-components";

const Container = styled.div<{ isCool: boolean }>`
  padding: 20px;
  background-color: ${({ isCool }) => (isCool ? "#bada55" : "#fff")};
`;

export const App: React.FC = () => <Container isCool>Hello, world!</Container>;
