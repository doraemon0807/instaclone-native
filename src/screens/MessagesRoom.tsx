import React, { useEffect, useRef, useState } from "react";
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
  useApolloClient,
  useMutation,
  useQuery,
  useReactiveVar,
  useSubscription,
} from "@apollo/client";
import ScreenLayout from "../components/shared/ScreenLayout";
import {
  Message,
  RoomUpdateSubscription,
  SeeRoomQuery,
  SendMessageMutation,
} from "../gql/graphql";
import MessageItem from "../components/messages/MessageItem";
import { SubmitHandler, useForm } from "react-hook-form";
import useUser from "../hook/useUser";
import Ionicons from "@expo/vector-icons/Ionicons";
import { darkModeVar } from "../../apollo";
import { SEE_ROOMS_QUERY } from "./MessagesRooms";

type Props = NativeStackScreenProps<MessagesNavStackParamList, "MessageRoom">;

const ROOM_QUERY = graphql(`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        ...MessageFragment
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

const READ_MESSAGE = graphql(`
  mutation readMessage($id: Int!) {
    readMessage(id: $id) {
      ok
      error
      id
    }
  }
`);

const ROOM_UPDATE = graphql(`
  subscription roomUpdate($id: Int!) {
    roomUpdate(id: $id) {
      ...MessageFragment
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

interface ISubscriptionProps {
  subscriptionData: {
    data: RoomUpdateSubscription;
  };
}

export default function MessagesRoom({ route, navigation }: Props) {
  const darkMode = useReactiveVar(darkModeVar);
  const { data: meData } = useUser();
  // React Hook Form
  const { register, handleSubmit, setValue, getValues, watch } =
    useForm<IMessageForm>();

  //---MUTATION---//
  // function to update cache data
  const updateSendMessage = (
    cache: ApolloCache<Message>,
    result: IUpdateSendMessageProps
  ) => {
    console.log("UPDATE MESSAGE");
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
        readByAll: false,
        isMine: true,
        readByMe: true,
        user: {
          username: meData.me.profile?.username,
          avatar: meData.me.profile?.avatar,
          id: meData.me.profile?.id,
        },
      };

      //create fragment from fake cache data
      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment fakeMessage on Message {
            id
            payload
            readByAll
            isMine
            readByMe
            user {
              id
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

  // mutation function for sending a message
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );

  //--- QUERY && SUBSCRIPTION ---//
  const { data, loading, subscribeToMore, refetch } = useQuery(ROOM_QUERY, {
    variables: {
      id: route.params?.id!,
    },
  });

  const client = useApolloClient();

  //function to update query for subscription
  const updateQuery = (
    prev: SeeRoomQuery,
    { subscriptionData }: ISubscriptionProps
  ) => {
    const {
      data: { roomUpdate: message },
    } = subscriptionData;
    //if message exists
    if (message?.id) {
      //create fragment from message object
      const messageFragment = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            readByMe
            readByAll
            isMine
            user {
              id
              username
              avatar
            }
          }
        `,
        data: message,
      });

      //put created fragment to the existing cache
      client.cache.modify({
        id: `Room:${route.params?.id}`,
        fields: {
          messages(prev) {
            const existingMessage = prev.find(
              //to fix duplicated message issue: check if the message already exists in prev
              (aMessage: { __ref: string }) =>
                aMessage.__ref === messageFragment?.__ref
            );
            if (existingMessage) {
              return prev;
            }
            return [messageFragment, ...prev];
          },
        },
      });
    }
  };

  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    //check if we have a message
    if (data?.seeRoom && !subscribed) {
      //then subscribe
      subscribeToMore({
        document: ROOM_UPDATE,
        variables: {
          id: route.params?.id!,
        },
        updateQuery: updateQuery as any,
      });
      setSubscribed(true);
    }
  }, [data, subscribed]);

  useEffect(() => {
    register("message", { required: true });
  }, [register]);

  useEffect(() => {
    refetch();
  }, []);

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
          : `Group Chat (${
              route.params?.opponents?.length &&
              route.params?.opponents?.length + 1
            })`,
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

  //---mutation---//

  // mutation function for readMessage
  const [readMessageMutation, { loading: readingMessage }] = useMutation(
    READ_MESSAGE,
    {
      refetchQueries: [{ query: SEE_ROOMS_QUERY }],
    }
  );

  // useEffect(() => {
  //   if (data?.seeRoom?.messages) {
  //     data.seeRoom.messages.map((message) => {
  //       if (message) {
  //         readMessageMutation({
  //           variables: {
  //             id: message.id!,
  //           },
  //         });
  //       }
  //     });
  //   }
  // }, []);

  // each message rendered in flatlist
  const renderItem: ListRenderItem<Message> = ({ item }) => {
    return <MessageItem message={item} />;
  };

  const onViewableItemsChanged = ({ viewableItems, changed }: any) => {
    console.log(viewableItems[1].item);

    if (viewableItems.length !== 0) {
      viewableItems.map((item: any) => {
        readMessageMutation({
          variables: {
            id: item.item.id,
          },
        });
      });
    }
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 100 };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

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
          viewabilityConfig={viewabilityConfig}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
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
