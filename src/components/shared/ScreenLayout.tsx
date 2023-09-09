import React from "react";
import styled from "styled-components/native";
import { IThemeProps, darkTheme, lightTheme } from "../../../styles";
import { ActivityIndicator } from "react-native";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../../apollo";

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

interface IScreenLayoutProps {
  loading?: boolean;
  children: React.ReactNode;
}

export default function ScreenLayout({
  loading,
  children,
}: IScreenLayoutProps) {
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <Container>
      {loading ? (
        <ActivityIndicator
          color={darkMode ? darkTheme.fontColor : lightTheme.fontColor}
        />
      ) : (
        children
      )}
    </Container>
  );
}
