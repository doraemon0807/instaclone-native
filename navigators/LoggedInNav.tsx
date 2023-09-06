import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import UploadNav from "./UploadNav";

export type LoggedInNavStackParamList = {
  Tabs: undefined;
  Upload: undefined;
};

const Stack = createStackNavigator<LoggedInNavStackParamList>();

export default function LoggedInNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "modal",
      }}
    >
      <Stack.Screen name="Tabs" component={TabsNav} />
      <Stack.Screen name="Upload" component={UploadNav} />
    </Stack.Navigator>
  );
}
