import { Text, View } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../styles";
import { logUserOut } from "../apollo";
import Button from "../components/Button";

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default function Me() {
  return (
    <Container>
      <Text style={{ color: "white" }}>Hello This is Me!</Text>
      <Button disabled={false} onPress={logUserOut} text="Logout" />
    </Container>
  );
}
