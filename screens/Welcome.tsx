import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigators/LoggedOutNav";
import { IThemeProps } from "../styles";
import styled from "styled-components/native";
import { useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const Login = styled.TouchableOpacity``;

const LoginLink = styled.Text`
  color: ${(props: IThemeProps) => props.theme.accentNormal};
  font-weight: 600;
  margin-top: 10px;
  font-size: 16px;
`;

export default function Welcome({ navigation }: Props) {
  const goToCreateAccount = () => navigation.navigate("CreateAccount");
  const goToLogin = () => navigation.navigate("Login");

  return (
    <AuthLayout>
      <Button
        disabled={false}
        onPress={goToCreateAccount}
        text="Create New Account"
      ></Button>
      <Login>
        <LoginLink onPress={goToLogin}>Log in</LoginLink>
      </Login>
    </AuthLayout>
  );
}
