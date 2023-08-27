import { Text, View } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../styles";

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default function Likes() {
  return (
    <Container>
      <Text style={{ color: "white" }}>Hello This is LIKE!</Text>
    </Container>
  );
}
