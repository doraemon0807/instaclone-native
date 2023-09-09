import styled from "styled-components/native";
import { IThemeProps } from "../../../styles";
import { TouchableOpacityProps } from "react-native";

const HeaderButtonContainer: React.FC<TouchableOpacityProps> = styled.TouchableOpacity``;

const HeaderButtonText = styled.Text`
  color: ${(props: IThemeProps) => props.theme.accentNormal};
  font-size: 18px;
  font-weight: 500;
  margin-right: 8px;
`;

interface IHeaderButtonProp {
  buttonFunction?: () => void;
  buttonName: string;
}

export default function HeaderButton({
  buttonFunction,
  buttonName,
}: IHeaderButtonProp) {
  return (
    <HeaderButtonContainer onPress={buttonFunction}>
      <HeaderButtonText>{buttonName}</HeaderButtonText>
    </HeaderButtonContainer>
  );
}
