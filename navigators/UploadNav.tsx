import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../apollo";
import { darkTheme, lightTheme } from "../styles";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

export type UploadNavStackParamList = {
  Select: undefined;
  UploadForm: IUploadFormProps | undefined;
};

export type UploadNavTabParamList = {
  TakePhoto: undefined;
  SelectPhoto: undefined;
  Tabs: undefined;
  UploadForm: IUploadFormProps | undefined;
};

interface IUploadFormProps {
  file: string;
}

const Tab = createMaterialTopTabNavigator<UploadNavTabParamList>();
const Stack = createStackNavigator<UploadNavStackParamList>();

export default function UploadNav() {
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: darkMode ? darkTheme.bgColor : lightTheme.bgColor,
        },
        tabBarActiveTintColor: darkMode
          ? darkTheme.fontColor
          : lightTheme.fontColor,
        tabBarIndicatorStyle: {
          backgroundColor: darkMode
            ? darkTheme.borderColor
            : lightTheme.borderColor,
          top: 0,
        },
      }}
    >
      <Tab.Screen name="SelectPhoto" options={{ title: "Gallery" }}>
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                shadowOpacity: 0.3,
                backgroundColor: darkMode
                  ? darkTheme.bgColor
                  : lightTheme.bgColor,
              },
              headerTintColor: darkMode
                ? darkTheme.fontColor
                : lightTheme.fontColor,
              headerBackTitleVisible: false,
              headerTitleAlign: "center",
              headerBackImage: ({ tintColor }) => (
                <Ionicons color={tintColor} name="close" size={28} />
              ),
            }}
          >
            <Stack.Screen
              name="Select"
              options={{ title: "Choose a Photo" }}
              component={SelectPhoto}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="TakePhoto"
        component={TakePhoto}
        options={{ title: "Camera" }}
      />
    </Tab.Navigator>
  );
}
