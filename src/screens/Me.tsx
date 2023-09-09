import React, { useEffect } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../../styles";
import { logUserOut } from "../../apollo";
import Button from "../components/shared/Button";
import useUser from "../hook/useUser";
import { StackParamList } from "../navigators/SharedStackNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<StackParamList, "Me">;

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default function Me({ navigation }: Props) {
  const { data } = useUser();

  useEffect(() => {
    navigation.setOptions({
      title: data?.me.profile?.username,
    });
  }, []);

  return (
    <Container>
      <Text style={{ color: "white" }}>
        Hello This is {data?.me.profile?.username}!
      </Text>
      <Button disabled={false} onPress={logUserOut} text="Logout" />
    </Container>
  );
}
