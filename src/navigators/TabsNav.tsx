import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../apollo";
import { darkTheme, lightTheme } from "../../styles";
import { View } from "react-native";
import TabIcon from "../components/nav/TabIcon";
import useUser from "../hook/useUser";
import Avatar from "../components/shared/Avatar";
import SharedStackNav from "./SharedStackNav";
import MessagesNav from "./MessagesNav";

export type TabsParamList = {
  TabFeed: undefined;
  TabSearch: undefined;
  Camera: undefined;
  TabMessage: undefined;
  TabMe: undefined;
};

const Tabs = createBottomTabNavigator<TabsParamList>();

export default function TabsNav() {
  const darkMode = useReactiveVar(darkModeVar);

  const { data } = useUser();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: darkMode
          ? darkTheme.grayNormal
          : lightTheme.grayNormal,
        tabBarActiveTintColor: darkMode
          ? darkTheme.fontColor
          : lightTheme.fontColor,
        tabBarStyle: {
          backgroundColor: darkMode ? darkTheme.bgColor : lightTheme.bgColor,
          borderTopColor: darkTheme.grayLight,
        },
      }}
    >
      <Tabs.Screen
        name="TabFeed"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName="home" focused={focused} color={color} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Feed" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="TabSearch"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName="search" focused={focused} color={color} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Search" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Camera"
        component={View}
        listeners={({ navigation }) => {
          return {
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Upload");
            },
          };
        }}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName="camera" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="TabMessage"
        component={MessagesNav}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName="paper-plane" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="TabMe"
        options={{
          tabBarIcon: ({ focused, color }) =>
            data?.me.profile?.avatar ? (
              <Avatar
                avatarUrl={data.me.profile.avatar}
                size="small"
                focused={focused}
              />
            ) : (
              <TabIcon iconName="person" focused={focused} color={color} />
            ),
        }}
      >
        {() => <SharedStackNav screenName="Me" />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}
