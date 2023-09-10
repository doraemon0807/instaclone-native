import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import UploadNav from "./UploadNav";
import UploadForm from "../screens/UploadForm";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../apollo";
import { darkTheme, lightTheme } from "../../styles";
import { Ionicons } from "@expo/vector-icons";

export type LoggedInNavStackParamList = {
  Tabs: undefined;
  Upload: undefined;
  UploadForm: undefined;
};

const Stack = createStackNavigator<LoggedInNavStackParamList>();

export default function LoggedInNav() {
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "modal",
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="Tabs"
        component={TabsNav}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Upload"
        component={UploadNav}
      />
      <Stack.Screen
        options={{
          title: "Upload",
          headerStyle: {
            shadowOpacity: 0.3,
            backgroundColor: darkMode ? darkTheme.bgColor : lightTheme.bgColor,
          },
          headerTintColor: darkMode
            ? darkTheme.fontColor
            : lightTheme.fontColor,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="chevron-back" size={28} />
          ),
        }}
        name="UploadForm"
        component={UploadForm}
      />
    </Stack.Navigator>
  );
}
