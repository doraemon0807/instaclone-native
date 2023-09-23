import styled from "styled-components/native";
import { IThemeProps } from "../../../styles";
import { ActivityIndicator } from "react-native";

interface IThemeWithProps extends IThemeProps {
  disabled?: boolean;
  $accent?: boolean;
}

export const SButton = styled.TouchableOpacity<{
  disabled?: boolean;
  $accent?: boolean;
}>`
  background-color: ${(props: IThemeWithProps) =>
    props.$accent ? props.theme.accentNormal : "#dbdbdb"};

  padding: 10px;
  width: 100%;
  border-radius: 5px;
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? "0.5" : "1")};
`;

export const SButtonText = styled.Text<{
  $accent?: boolean;
}>`
  color: ${(props: IThemeWithProps) => (props.$accent ? "white" : "black")};
  font-weight: 500;
  font-size: 16px;
  text-align: center;
`;

interface IProps {
  text: string;
  disabled?: boolean;
  onPress?: () => void;
  loading?: boolean;
  $accent?: boolean;
}

export default function Button({
  disabled,
  text,
  onPress,
  loading,
  $accent,
}: IProps) {
  return (
    <SButton disabled={disabled} onPress={onPress} $accent={$accent}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <SButtonText $accent={$accent}>{text}</SButtonText>
      )}
    </SButton>
  );
}
