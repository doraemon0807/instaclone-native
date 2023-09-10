import React, { useState } from "react";
import { RefreshControl, ScrollViewProps } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../../styles";
import { StackParamList } from "../navigators/SharedStackNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { graphql } from "../gql";
import { useQuery } from "@apollo/client";
import PhotoItem from "../components/photo/PhotoItem";
import ScreenLayout from "../components/shared/ScreenLayout";

type Props = NativeStackScreenProps<StackParamList, "Photo">;

const SEE_PHOTO = graphql(`
  query seePhoto($photoId: Int!) {
    seePhoto(id: $photoId) {
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

const Container: React.FC<ScrollViewProps> = styled.ScrollView`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
`;

export default function Photo({ route: { params } }: Props) {
  const { data, loading, refetch } = useQuery(SEE_PHOTO, {
    variables: {
      photoId: params?.photoId!,
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <Container
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {data?.seePhoto ? <PhotoItem {...data.seePhoto} /> : null}
      </Container>
    </ScreenLayout>
  );
}
