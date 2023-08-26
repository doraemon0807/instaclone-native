import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Profile from "../screens/Profile";
import Photo from "../screens/Photo";
import Feed from "../screens/Feed";
import Me from "../screens/Me";
import Notifications from "../screens/Notifications";
import Search from "../screens/Search";
import { darkModeVar } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import { darkTheme, lightTheme } from "../styles";
import styled from "styled-components/native";

export type StackParamList = {
  Feed: undefined;
  Search: undefined;
  Notifications: undefined;
  Me: undefined;
  Profile: undefined;
  Photo: undefined;
};

interface ISharedStackNavProps {
  screenName: string;
}

const Logo = styled.Image`
  max-width: 100%;
  max-height: 40px;
`;

const Stack = createStackNavigator<StackParamList>();

export default function SharedStackNav({ screenName }: ISharedStackNavProps) {
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: "screen",
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
        headerTintColor: darkMode ? darkTheme.fontColor : lightTheme.fontColor,
        headerStyle: {
          backgroundColor: darkMode ? darkTheme.bgColor : lightTheme.bgColor,
          shadowColor: darkTheme.grayLight,
        },
        presentation: "transparentModal",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {screenName === "Feed" ? (
        <Stack.Screen
          name="Feed"
          component={Feed}
          options={{
            headerTitle: () => (
              <Logo
                resizeMode="contain"
                source={
                  darkMode
                    ? require("../assets/logo_dark.png")
                    : require("../assets/logo_light.png")
                }
              />
            ),
          }}
        />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name="Search" component={Search} />
      ) : null}
      {screenName === "Notifications" ? (
        <Stack.Screen name="Notifications" component={Notifications} />
      ) : null}
      {screenName === "Me" ? <Stack.Screen name="Me" component={Me} /> : null}

      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Photo" component={Photo} />
    </Stack.Navigator>
  );
}