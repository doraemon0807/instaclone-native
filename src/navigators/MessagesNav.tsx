import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import MessagesRooms from "../screens/MessagesRooms";
import MessagesRoom from "../screens/MessagesRoom";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../apollo";
import { darkTheme, lightTheme } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { User } from "../gql/graphql";

export type MessagesNavStackParamList = {
  MessageRooms: undefined;
  MessageRoom: IMessageRoomProps | undefined;
};

interface IMessageRoomProps {
  id: number;
  opponents?: User[];
}

const Stack = createStackNavigator<MessagesNavStackParamList>();

export default function MessagesNav() {
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
        name="MessageRooms"
        component={MessagesRooms}
        options={{ title: "Messages" }}
      />
      <Stack.Screen
        name="MessageRoom"
        component={MessagesRoom}
        options={{
          title: "Message",
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="chevron-back" size={28} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
