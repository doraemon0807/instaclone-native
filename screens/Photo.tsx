import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../styles";
import { StackParamList } from "../navigators/SharedStackNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<StackParamList, "Photo">;

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default function Photo({ navigation }: Props) {
  return (
    <Container>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Text style={{ color: "white" }}>Profile</Text>
      </TouchableOpacity>
    </Container>
  );
}
