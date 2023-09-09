import React from "react";
import styled from "styled-components/native";
import { IThemeProps } from "../../../styles";
import { ImageProps, KeyboardAvoidingView, Platform } from "react-native";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../../apollo";
import DismissKeyboard from "../shared/DismissKeyboard";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  padding: 0px 20px;
`;

const Logo: React.FC<ImageProps> = styled.Image`
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
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <DismissKeyboard>
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
              darkMode
                ? require("../../../assets/logo_dark.png")
                : require("../../../assets/logo_light.png")
            }
          />
          {children}
        </KeyboardAvoidingView>
      </Container>
    </DismissKeyboard>
  );
}
