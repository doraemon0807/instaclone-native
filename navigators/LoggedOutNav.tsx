import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../screens/Welcome";
import Login, { ILoginForm } from "../screens/Login";
import CreateAccount from "../screens/CreateAccount";

export type LoggedOutNavStackParamList = {
  Welcome: undefined;
  Login: ILoginForm | undefined;
  CreateAccount: undefined;
};

const Stack = createStackNavigator<LoggedOutNavStackParamList>();

export default function LoggedOutNav() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: () => false,
        headerTransparent: true,
        headerTintColor: "white",
        presentation: "modal",
      }}
    >
      <Stack.Screen
        name="Welcome"
        options={{ headerShown: false }}
        component={Welcome}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
}
