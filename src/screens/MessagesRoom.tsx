import React, { useEffect } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  TextInputProps,
} from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../../styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessagesNavStackParamList } from "../navigators/MessagesNav";
import { graphql } from "../gql";
import { useQuery } from "@apollo/client";
import ScreenLayout from "../components/shared/ScreenLayout";
import { Message } from "../gql/graphql";
import MessageItem from "../components/messages/MessageItem";

type Props = NativeStackScreenProps<MessagesNavStackParamList, "MessageRoom">;

const ROOM_QUERY = graphql(`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      messages {
        id
        payload
        read
        isMine
        user {
          username
          avatar
        }
      }
    }
  }
`);

const SEND_MESSAGE_MUTATION = graphql(`
  mutation sendMessage($payload: String!, $roomId: Int, $userIds: [Int]) {
    sendMessage(payload: $payload, roomId: $roomId, userIds: $userIds) {
      ok
      error
      id
    }
  }
`);

const InputContainer = styled.View`
  width: 100%;
  padding: 10px;
`;

const TextInput: React.FC<TextInputProps> = styled.TextInput.attrs(
  (props: IThemeProps) => ({
    placeholderTextColor: props.theme.grayNormal,
  })
)`
  width: 100%;
  border: 2px solid ${(props: IThemeProps) => props.theme.borderColor};
  color: ${(props: IThemeProps) => props.theme.fontColor};
  padding: 8px 20px;
  border-radius: 50px;
`;

export default function MessagesRoom({ route, navigation }: Props) {
  //---query---//
  const { data, loading } = useQuery(ROOM_QUERY, {
    variables: {
      id: route.params?.id!,
    },
  });

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <MessageItem message={item} />
  );

  // title on the header
  useEffect(() => {
    navigation.setOptions({
      title:
        route.params?.opponents?.length === 1
          ? route.params?.opponents?.[0].username
          : `Group Chat (${route.params?.opponents?.length})`,
    });
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled
      behavior="padding"
      keyboardVerticalOffset={-140}
    >
      <ScreenLayout loading={loading}>
        <FlatList
          inverted
          style={{ width: "100%", flex: 1 }}
          keyExtractor={(message) => message?.id + ""}
          renderItem={renderItem}
          data={data?.seeRoom?.messages as Message[]}
        />
        <InputContainer>
          <TextInput placeholder="Write a message..." returnKeyType="send" />
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
