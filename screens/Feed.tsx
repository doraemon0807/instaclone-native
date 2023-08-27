import React from "react";
import { StackParamList } from "../navigators/SharedStackNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@apollo/client";
import { graphql } from "../gql";
import { FlatList, Text, View } from "react-native";
import ScreenLayout from "../components/shared/ScreenLayout";
import PhotoItem from "../components/shared/PhotoItem";

type Props = NativeStackScreenProps<StackParamList, "Feed">;

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
  const { data, loading } = useQuery(FEED_QUERY);

  const renderPhoto = ({ item }: any) => {
    return <PhotoItem navigation={navigation} {...item} />;
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        data={data?.seeFeed.photos}
        keyExtractor={(photo) => photo?.id + ""}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
}
