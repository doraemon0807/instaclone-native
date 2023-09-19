import React, { useEffect } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../../styles";
import { logUserOut } from "../../apollo";
import Button from "../components/shared/Button";
import useUser from "../hook/useUser";
import { StackParamList } from "../navigators/SharedStackNav";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import Profile from "./Profile";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

type Props = NativeStackScreenProps<StackParamList, "Me">;

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

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
    <Profile
      navigation={profileNavigation}
      route={profileRoute}
      myProfile={true}
    />
  );
}
