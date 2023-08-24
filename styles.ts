import { DefaultTheme } from "styled-components/native";

export const lightTheme: DefaultTheme = {
  fontColor: "#2c2c2c",
  bgColor: "#fcfcfc",
  accentLight: "#4cb5f9",
  accentNormal: "#0095f6",
  accentDark: "#00376b",
  borderColor: "rgb(229,229,229)",
  grayLight: "#efefef",
  grayNormal: "#a2a2a2",
  grayDark: "#737373",
};

export const darkTheme: DefaultTheme = {
  fontColor: "#fcfcfc",
  bgColor: "#131313",
  accentLight: "#00376b",
  accentNormal: "#0095f6",
  accentDark: "#4cb5f9",
  borderColor: "rgb(229,229,229)",
  grayLight: "#737373",
  grayNormal: "#a2a2a2",
  grayDark: "#efefef",
};

export interface IThemeProps {
  theme: DefaultTheme;
}
