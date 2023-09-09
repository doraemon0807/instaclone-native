import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { IThemeProps, darkTheme, lightTheme } from "../../../styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../navigators/SharedStackNav";
import { Ionicons } from "@expo/vector-icons";
import { ApolloCache, useMutation, useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../../apollo";
import { graphql } from "../../gql";
import { Photo, ToggleLikeMutation } from "../../gql/graphql";
import Avatar from "../shared/Avatar";

const Container = styled.View``;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

const Username = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
  font-weight: 600;
  margin-left: 10px;
`;

const File = styled.Image``;

const ExtraContainer = styled.View`
  padding: 10px;
`;

const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 8px;
`;

const Likes = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
  font-weight: 600;
  margin: 4px 0px;
`;

const Caption = styled.View`
  flex-direction: row;
`;

const CaptionUsername = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
  font-weight: 600;
`;

const CaptionText = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
  margin-left: 5px;
  flex-shrink: 1;
`;

interface IPhotoItemProps {
  id: number;
  file: string;
  caption?: string | null;
  likes: number;
  commentCount: number;
  createdAt: string;
  isMine: boolean;
  isLiked: boolean;
  user: {
    id: number;
    username: string;
    avatar?: string | null;
    isFollowing: boolean;
    isMe: boolean;
  };
  comments?: Array<{
    id: number;
    payload: string;
    isMine: boolean;
    createdAt: string;
    user: {
      id: number;
      username: string;
      avatar?: string | null;
    };
  } | null> | null;
  navigation: NativeStackNavigationProp<
    StackParamList,
    "Feed" | "Photo",
    undefined
  >;
}

interface IUpdateToggleLikeProps {
  data?: ToggleLikeMutation | null;
}

const TOGGLE_LIKE_MUTATION = graphql(`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`);

export default function PhotoItem({
  id,
  user,
  file,
  isLiked,
  likes,
  caption,
  navigation,
}: IPhotoItemProps) {
  const darkMode = useReactiveVar(darkModeVar);

  //Find width and height of the screen
  const { width: sWidth, height: sHeight } = useWindowDimensions();

  //height-450 as default height
  const [imageHeight, setImageHeight] = useState(sHeight - 450);

  //if successful at getting image height, use that height
  useEffect(() => {
    Image.getSize(file, (width, height) => {
      setImageHeight((height * sWidth) / width);
    });
  }, [file]);

  // --- Toggle like MUTATION --- //
  // Function to update cache data
  const updateToggleLike = (
    cache: ApolloCache<Photo>,
    result: IUpdateToggleLikeProps
  ) => {
    if (!result.data) {
      return;
    }
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;

    if (ok) {
      // modify cache fragment
      const fragmentId = `Photo:${id}`;
      cache.modify({
        id: fragmentId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };

  //mutation function to toggle likes
  const [toggleLikeMutation, { loading: toggleLikeLoading }] = useMutation(
    TOGGLE_LIKE_MUTATION,
    {
      update: updateToggleLike,
    }
  );

  //function to call when like button is clicked
  const onLikeClick = () => {
    if (toggleLikeLoading) {
      return;
    }
    toggleLikeMutation({
      variables: {
        id,
      },
    });
  };

  //function to go to profile
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: user.username,
      id,
    });
  };

  return (
    <Container>
      <Header onPress={goToProfile}>
        <Avatar avatarUrl={user.avatar} size="small" />
        <Username>{user.username}</Username>
      </Header>
      <File
        resizeMode="contain"
        source={{ uri: file }}
        style={{ width: sWidth, height: imageHeight }}
      />
      <ExtraContainer>
        <Actions>
          <Action onPress={onLikeClick}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={
                isLiked
                  ? "tomato"
                  : darkMode
                  ? darkTheme.fontColor
                  : lightTheme.fontColor
              }
              size={26}
            />
          </Action>
          <Action onPress={() => navigation.navigate("Comments")}>
            <Ionicons
              name="chatbubble-outline"
              color={darkMode ? darkTheme.fontColor : lightTheme.fontColor}
              size={22}
            />
          </Action>
        </Actions>
        <TouchableOpacity
          onPress={() => navigation.navigate("Likes", { photoId: id })}
        >
          <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        </TouchableOpacity>
        <Caption>
          <TouchableOpacity onPress={goToProfile}>
            <CaptionUsername>{user.username}</CaptionUsername>
          </TouchableOpacity>
          <CaptionText>{caption}</CaptionText>
        </Caption>
      </ExtraContainer>
    </Container>
  );
}
