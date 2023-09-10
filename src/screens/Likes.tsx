import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigators/SharedStackNav";
import { graphql } from "../gql";
import { useQuery } from "@apollo/client";
import ScreenLayout from "../components/shared/ScreenLayout";
import UserRow from "../components/user/UserRow";
import Separator from "../components/shared/Separator";

type Props = NativeStackScreenProps<StackParamList, "Likes">;

const LIKE_QUERY = graphql(`
  query seePhotoLikes($photoId: Int!) {
    seePhotoLikes(id: $photoId) {
      ...UserFragment
    }
  }
`);

export default function Likes({ route: { params }, navigation }: Props) {
  // --- QUERY --- //
  const { data, loading, refetch, fetchMore } = useQuery(LIKE_QUERY, {
    skip: !params?.photoId,
    variables: {
      photoId: params?.photoId!,
    },
  });

  //render item once data is loaded
  const renderUser = ({ item: user }: any) => (
    <UserRow {...user} navigation={navigation} />
  );

  //refresh when pulled down
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={Separator}
        // infinite scroll implementation
        onEndReachedThreshold={0.3}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seePhotoLikes.length,
            },
          })
        }
        refreshing={refreshing}
        onRefresh={refresh}
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        data={data?.seePhotoLikes}
        keyExtractor={(item) => item?.id + ""}
        renderItem={renderUser}
      />
    </ScreenLayout>
  );
}
