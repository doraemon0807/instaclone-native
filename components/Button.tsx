import styled from "styled-components/native";
import { IThemeProps } from "../styles";
import { ActivityIndicator } from "react-native";

const SButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props: IThemeProps) => props.theme.accentNormal};
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? "0.5" : "1")};
`;

const SButtonText = styled.Text`
  color: white;
  font-size: 16px;
  text-align: center;
`;

interface IProps {
  text: string;
  disabled?: boolean;
  onPress?: () => void;
  loading?: boolean;
}

export default function Button({ disabled, text, onPress, loading }: IProps) {
  return (
    <SButton disabled={disabled} onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <SButtonText>{text}</SButtonText>
      )}
    </SButton>
  );
}
