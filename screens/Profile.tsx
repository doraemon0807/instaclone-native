import React, { useEffect } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../styles";
import { StackParamList } from "../navigators/SharedStackNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<StackParamList, "Profile">;

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default function Profile({ navigation, route }: Props) {
  useEffect(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: route?.params?.username,
      });
    }
  }, [route]);

  return (
    <Container>
      <Text style={{ color: "white" }}>
        Hello This is {route.params?.username}'s Profile!
      </Text>
    </Container>
  );
}
