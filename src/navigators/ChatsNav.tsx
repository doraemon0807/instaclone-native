import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import ChatRooms from "../screens/MessagesRooms";
import ChatRoom from "../screens/MessagesRoom";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../apollo";
import { darkTheme, lightTheme } from "../../styles";
import { Ionicons } from "@expo/vector-icons";

export type ChatsNavStackParamList = {
  ChatRooms: undefined;
  ChatRoom: undefined;
};

const Stack = createStackNavigator<ChatsNavStackParamList>();

export default function ChatsNav() {
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
      <Stack.Screen
        name="ChatRooms"
        component={ChatRooms}
        options={{ title: "Chats" }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          title: "Chat",
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="chevron-back" size={28} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
