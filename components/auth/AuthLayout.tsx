import styled from "styled-components/native";
import { IThemeProps } from "../../styles";
import { useColorScheme } from "react-native";

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
  margin-bottom: 10px;
`;

interface IProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: IProps) {
  const colorScheme = useColorScheme();

  return (
    <Container>
      <Logo
        resizeMode="contain"
        source={
          colorScheme === "dark"
            ? require("../../assets/logo_dark.png")
            : require("../../assets/logo_light.png")
        }
      />
      {children}
    </Container>
  );
}
