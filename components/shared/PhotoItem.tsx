import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { IThemeProps, darkTheme, lightTheme } from "../../styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../navigators/SharedStackNav";
import { Ionicons } from "@expo/vector-icons";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../apollo";

const Container = styled.View``;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 25px;
  margin-right: 10px;
`;
const Username = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
  font-weight: 600;
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

const CaptionUsername = styled.TouchableOpacity``;

const CaptionText = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
  margin-left: 5px;
  flex-shrink: 1;
`;

interface IPhotoProps {
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
  navigation: NativeStackNavigationProp<StackParamList, "Feed", undefined>;
}

export default function PhotoItem({
  id,
  user,
  file,
  isLiked,
  likes,
  caption,
  comments,
  commentCount,
  navigation,
}: IPhotoProps) {
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

  return (
    <Container>
      <Header onPress={() => navigation.navigate("Profile")}>
        <UserAvatar resizeMode="cover" source={{ uri: user.avatar }} />
        <Username>{user.username}</Username>
      </Header>
      <File
        resizeMode="contain"
        source={{ uri: file }}
        style={{ width: sWidth, height: imageHeight }}
      />
      <ExtraContainer>
        <Actions>
          <Action>
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
        <TouchableOpacity onPress={() => navigation.navigate("Likes")}>
          <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        </TouchableOpacity>
        <Caption>
          <CaptionUsername onPress={() => navigation.navigate("Profile")}>
            <Username>{user.username}</Username>
          </CaptionUsername>
          <CaptionText>{caption}</CaptionText>
        </Caption>
      </ExtraContainer>
    </Container>
  );
}
