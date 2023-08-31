import React, { useEffect } from "react";
import { Text, TextInputProps, View } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackParamList } from "../navigators/SharedStackNav";
import DismissKeyboard from "../components/shared/DismissKeyboard";
import { useForm } from "react-hook-form";

type Props = NativeStackScreenProps<StackParamList, "Search">;

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Input: React.FC<TextInputProps> = styled.TextInput`
  background-color: white;
`;

export default function Search({ navigation }: Props) {
  const { setValue, register } = useForm();

  const SearchBox = () => (
    <Input
      placeholderTextColor="black"
      placeholder="Search Photo"
      autoCapitalize="none"
      returnKeyType="search"
      autoCorrect={false}
      onChangeText={(text) => setValue("keyword", text)}
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
    register("keyword");
  }, [navigation]);

  return (
    <DismissKeyboard>
      <Container>
        <TouchableOpacity onPress={() => navigation.navigate("Photo")}>
          <Text style={{ color: "white" }}>Photo</Text>
        </TouchableOpacity>
      </Container>
    </DismissKeyboard>
  );
}
