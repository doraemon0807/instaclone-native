import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackParamList } from "../navigators/SharedStackNav";

type Props = NativeStackScreenProps<StackParamList, "Search">;

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default function Search({ navigation }: Props) {
  return (
    <Container>
      <TouchableOpacity onPress={() => navigation.navigate("Photo")}>
        <Text style={{ color: "white" }}>Photo</Text>
      </TouchableOpacity>
    </Container>
  );
}
