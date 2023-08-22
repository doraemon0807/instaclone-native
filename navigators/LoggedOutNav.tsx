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
    <RootStack.Navigator initialRouteName="Welcome">
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="CreateAccount" component={CreateAccount} />
      <RootStack.Screen name="Welcome" component={Welcome} />
    </RootStack.Navigator>
  );
}
