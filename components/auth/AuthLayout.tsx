import styled from "styled-components/native";
import { IThemeProps } from "../../styles";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  padding: 0px 20px;
`;

const Logo = styled.Image`
  max-width: 70%;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  margin-bottom: 10px;
`;

interface IProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: IProps) {
  const colorScheme = useColorScheme();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard}>
      <Container>
        <KeyboardAvoidingView
          style={{
            width: "100%",
          }}
          behavior="position"
          keyboardVerticalOffset={Platform.OS === "ios" ? 50 : -100}
        >
          <Logo
            resizeMode="contain"
            source={
              colorScheme === "dark"
                ? require("../../assets/logo_dark.png")
                : require("../../assets/logo_light.png")
            }
          />
          {children}
        </KeyboardAvoidingView>
      </Container>
    </TouchableWithoutFeedback>
  );
}
