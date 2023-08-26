import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackParamList } from "../navigators/SharedStackNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@apollo/client";
import { graphql } from "../gql";

type Props = NativeStackScreenProps<StackParamList, "Feed">;

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const FEED_QUERY = graphql(`
  query seeFeed {
    seeFeed {
      ok
      error
      photos {
        ...PhotoFragment
        user {
          ...UserFragment
        }
        comments {
          ...CommentFragment
        }
      }
    }
  }
`);

export default function Feed({ navigation }: Props) {
  // --- QUERY --- //
  const { data } = useQuery(FEED_QUERY);

  console.log(data);

  return (
    <Container>
      <Text style={{ color: "white" }}>Photo</Text>
    </Container>
  );
}
