import React, { useEffect } from "react";
import useUser from "../hook/useUser";
import { StackParamList } from "../navigators/SharedStackNav";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import Profile from "./Profile";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

type Props = NativeStackScreenProps<StackParamList, "Me">;

export default function Me({ navigation }: Props) {
  const { data } = useUser();

  const profileNavigation: NativeStackNavigationProp<
    StackParamList,
    "Profile",
    undefined
  > = useNavigation();
  const profileRoute: RouteProp<StackParamList, "Profile"> = useRoute();

  useEffect(() => {
    navigation.setOptions({
      title: data?.me.profile?.username,
    });
  }, []);

  return (
    <Profile navigation={profileNavigation} route={profileRoute} isMe={true} />
  );
}
