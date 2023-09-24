import styled from "styled-components/native";
import { RefObject } from "react";
import { IThemeProps } from "../../../styles";

const STextInput = styled.TextInput.attrs((props: IThemeProps) => ({
  placeholderTextColor: props.theme.grayNormal,
}))<{ lastOne?: boolean }>`
  background-color: ${(props: IThemeProps) => props.theme.grayLight};
  padding: 10px 8px;
  border-radius: 4px;
  width: 100%;
  color: ${(props: IThemeProps) => props.theme.fontColor};
  margin-bottom: ${(props: { lastOne?: boolean }) =>
    props.lastOne ? "15" : "8"}px;
`;

interface IProps {
  innerRef?: RefObject<HTMLInputElement>;
  lastOne?: boolean;
  [x: string]: any;
}

export default function AuthInput({ innerRef, lastOne, ...props }: IProps) {
  return <STextInput {...props} ref={innerRef} lastOne={lastOne} />;
}
