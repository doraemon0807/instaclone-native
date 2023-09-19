import React, { useState } from "react";
import { FlatList, ListRenderItem } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessagesNavStackParamList } from "../navigators/MessagesNav";
import { graphql } from "../gql";
import { useQuery } from "@apollo/client";
import ScreenLayout from "../components/shared/ScreenLayout";
import RoomItem from "../components/messages/RoomItem";
import Separator from "../components/shared/Separator";
import { Room, User } from "../gql/graphql";

const SEE_ROOMS_QUERY = graphql(`
  query seeRooms {
    seeRooms {
      ...RoomFragment
    }
  }
`);

export default function MessagesRooms() {
  // --- query --- //
  const { data, loading, refetch } = useQuery(SEE_ROOMS_QUERY);

  const renderItem: ListRenderItem<Room> = ({ item }) => (
    <RoomItem
      id={item.id}
      users={item.users as User[]}
      unreadTotal={item.unreadTotal}
    />
  );

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
        style={{ flex: 1, width: "100%" }}
        data={data?.seeRooms as Room[]}
        keyExtractor={(room) => room?.id + ""}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        //refetch when scrolled down
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
      />
    </ScreenLayout>
  );
}
