import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Text, View } from "react-native";
import { RootStackParamList } from "../navigators/LoggedOutNav";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function Welcome({ navigation }: Props) {
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
}
