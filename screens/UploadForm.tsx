import React from "react";
import { Text, View } from "react-native";
import { UploadNavTabParamList } from "../navigators/UploadNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<UploadNavTabParamList, "UploadForm">;

export default function UploadForm({ route }: Props) {
  console.log(route);
  return (
    <View>
      <Text>Upload screen</Text>
    </View>
  );
}
