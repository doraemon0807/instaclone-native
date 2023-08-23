import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigators/LoggedOutNav";
import { IThemeProps } from "../styles";
import styled from "styled-components/native";
import { Image } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const Container = styled.View`
  flex: 1;
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
`;

const Logo = styled.Image`
  max-width: 400px;
`;

export default function Welcome({ navigation }: Props) {
  return (
    <Container>
      <Logo resizeMode="center" source={require("../assets/logo.png")} />
    </Container>
  );
}
