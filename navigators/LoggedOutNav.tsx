import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import CreateAccount from "../screens/CreateAccount";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  CreateAccount: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export default function LoggedOutNav() {
  return (
    <RootStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: () => false,
        headerTransparent: true,
        headerTintColor: "white",
        presentation: "modal",
      }}
    >
      <RootStack.Screen
        name="Welcome"
        options={{ headerShown: false }}
        component={Welcome}
      />
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="CreateAccount" component={CreateAccount} />
    </RootStack.Navigator>
  );
}
