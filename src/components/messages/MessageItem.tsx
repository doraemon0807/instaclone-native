import React from "react";
import Avatar from "../shared/Avatar";
import { Message } from "../../gql/graphql";
import styled from "styled-components/native";
import { IThemeProps } from "../../../styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { MessagesNavStackParamList } from "../../navigators/MessagesNav";

interface IMessageItemProps {
  message: Message;
}

interface IMessageContainerProps {
  isMine: boolean;
}

const MessageWrapper = styled.View``;

const MessageContainer = styled.View<IMessageContainerProps>`
  flex-direction: ${(props: IMessageContainerProps) =>
    props.isMine ? "row-reverse" : "row"};
  align-items: center;
  padding: 0px 10px;
`;
const Author = styled.TouchableOpacity``;

const MessageText = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
  padding: 5px 10px;
  border-radius: 10px;
  overflow: hidden;
  background-color: ${(props: IThemeProps) => props.theme.accentNormal};
  font-size: 16px;
  margin: 0px 10px;
  max-width: 80%;
`;

export default function MessageItem({ message }: IMessageItemProps) {
  const navigation: NativeStackNavigationProp<
    MessagesNavStackParamList,
    "Profile",
    undefined
  > = useNavigation();

  //function to go to profile
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: message.user.username,
      id: message.user.id,
    });
  };

  return (
    <MessageWrapper>
      <MessageContainer isMine={message.isMine}>
        <Author onPress={goToProfile}>
          <Avatar size="small" avatarUrl={message.user.avatar} />
        </Author>
        <MessageText>{message.payload}</MessageText>
      </MessageContainer>
    </MessageWrapper>
  );
}
