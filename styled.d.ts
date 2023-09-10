import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    fontColor: string;
    bgColor: string;
    grayLight: string;
    grayNormal: string;
    grayDark: string;
    accentLight: string;
    accentNormal: string;
    accentDark: string;
    borderColor: string;
    red: string;
  }
}
