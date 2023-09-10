import React, { useState } from "react";
import { StackParamList } from "../navigators/SharedStackNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@apollo/client";
import { graphql } from "../gql";
import { FlatList } from "react-native";
import ScreenLayout from "../components/shared/ScreenLayout";
import PhotoItem from "../components/photo/PhotoItem";

type Props = NativeStackScreenProps<StackParamList, "Feed">;

const FEED_QUERY = graphql(`
  query seeFeed($offset: Int) {
    seeFeed(offset: $offset) {
      ...PhotoFragment
      user {
        ...UserFragment
      }
      comments {
        ...CommentFragment
      }
    }
  }
`);

export default function Feed() {
  // --- QUERY --- //
  const { data, loading, refetch, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
    },
  });

  // render item once data is loaded
  const renderPhoto = ({ item }: any) => {
    return <PhotoItem {...item} />;
  };

  // refresh when pulled down
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        // infinite scroll implementation
        onEndReachedThreshold={0.3}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeFeed?.length,
            },
          })
        }
        //refetch when scrolled down
        refreshing={refreshing}
        onRefresh={refresh}
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        data={data?.seeFeed}
        keyExtractor={(photo) => photo?.id + ""}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
}
