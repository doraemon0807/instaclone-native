import React, { useEffect } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  TextInputProps,
  TouchableOpacityProps,
  View,
} from "react-native";
import styled from "styled-components/native";
import { IThemeProps, darkTheme, lightTheme } from "../../styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessagesNavStackParamList } from "../navigators/MessagesNav";
import { graphql } from "../gql";
import {
  ApolloCache,
  gql,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import ScreenLayout from "../components/shared/ScreenLayout";
import { Message, SendMessageMutation } from "../gql/graphql";
import MessageItem from "../components/messages/MessageItem";
import { SubmitHandler, useForm } from "react-hook-form";
import useUser from "../hook/useUser";
import Ionicons from "@expo/vector-icons/Ionicons";
import { darkModeVar } from "../../apollo";

type Props = NativeStackScreenProps<MessagesNavStackParamList, "MessageRoom">;

const ROOM_QUERY = graphql(`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
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
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TextInput: React.FC<TextInputProps> = styled.TextInput.attrs(
  (props: IThemeProps) => ({
    placeholderTextColor: props.theme.grayNormal,
  })
)`
  width: 90%;
  border: 2px solid ${(props: IThemeProps) => props.theme.borderColor};
  color: ${(props: IThemeProps) => props.theme.fontColor};
  padding: 5px 20px;
  border-radius: 50px;
  margin-right: 10px;
`;

const SendBtn: React.FC<TouchableOpacityProps> = styled.TouchableOpacity``;

interface IMessageForm {
  message: string;
}

interface IUpdateSendMessageProps {
  data?: SendMessageMutation | null;
}

export default function MessagesRoom({ route, navigation }: Props) {
  const darkMode = useReactiveVar(darkModeVar);

  const { data: meData } = useUser();
  // React Hook Form
  const { register, handleSubmit, setValue, getValues, watch } =
    useForm<IMessageForm>();

  useEffect(() => {
    register("message", { required: true });
  }, [register]);

  //---query---//
  const { data, loading } = useQuery(ROOM_QUERY, {
    variables: {
      id: route.params?.id!,
    },
  });

  //---mutation---//
  // function to update cache data
  const updateSendMessage = (
    cache: ApolloCache<Message>,
    result: IUpdateSendMessageProps
  ) => {
    if (!result.data) {
      return;
    }
    const {
      data: {
        sendMessage: { ok, error, id },
      },
    } = result;

    if (ok && meData) {
      // modify cache fragment
      const { message } = getValues();

      //empty message input
      setValue("message", "");

      //fake cache message object
      const messageObj = {
        __typename: "Message",
        id: id!,
        payload: message,
        isMine: true,
        read: true,
        user: {
          username: meData.me.profile?.username,
          avatar: meData.me.profile?.avatar,
          id: meData.me.profile?.id,
        },
      };

      //create fragment from fake cache data
      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            read
            isMine
            user {
              username
              avatar
            }
          }
        `,
        data: messageObj,
      });

      //put fake fragment to the existing cache
      cache.modify({
        id: `Room:${route.params?.id}`,
        fields: {
          messages(prev) {
            return [messageFragment, ...prev];
          },
        },
      });
    }
  };

  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );

  const opponentsIdArray = () => {
    let ids: number[] = [];
    route.params?.opponents?.map((opponent) => {
      ids.push(opponent.id);
    });
    return ids;
  };

  const opponentsIds = opponentsIdArray();

  // title on the header
  useEffect(() => {
    navigation.setOptions({
      title:
        route.params?.opponents?.length === 1
          ? route.params?.opponents?.[0].username
          : `Group Chat (${route.params?.opponents?.length})`,
    });
  }, []);

  const onSubmitValid: SubmitHandler<IMessageForm> = ({ message }) => {
    if (!sendingMessage) {
      sendMessageMutation({
        variables: {
          payload: message,
          roomId: route.params?.id,
          userIds: opponentsIds,
        },
      });
    }
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <MessageItem message={item} />
  );

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
          style={{ width: "100%", flex: 1, marginVertical: 10 }}
          keyExtractor={(message) => message?.id + ""}
          renderItem={renderItem}
          data={data?.seeRoom?.messages as Message[]}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
        <InputContainer>
          <TextInput
            onChangeText={(text: string) => setValue("message", text)}
            placeholder="Write a message..."
            returnKeyType="send"
            onSubmitEditing={handleSubmit(onSubmitValid)}
            value={watch("message")}
          />
          <SendBtn
            disabled={!Boolean(watch("message"))}
            onPress={handleSubmit(onSubmitValid)}
          >
            <Ionicons
              name="send"
              color={
                !Boolean(watch("message"))
                  ? darkTheme.grayLight
                  : darkMode
                  ? darkTheme.fontColor
                  : lightTheme.fontColor
              }
              size={22}
            />
          </SendBtn>
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
