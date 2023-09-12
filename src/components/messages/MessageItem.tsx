import React, { useState, useEffect } from "react";
import Avatar from "../shared/Avatar";
import { Message } from "../../gql/graphql";
import styled from "styled-components/native";
import { IThemeProps } from "../../../styles";
import Separator from "../shared/Separator";
import { View } from "react-native";

interface IMessageItemProps {
  message: Message;
  index: number;
}

interface IMessageContainerProps {
  isMine: boolean;
}

const MessageWrapper = styled.View``;

const LastReadSeparatorContainer = styled.View`
  display: inline;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LastReadSeparator = styled.View`
  height: 1px;
  width: 100%;
  /* background-color: red; */
  border: 0.5px dashed red;
`;

const LastReadText = styled.Text`
  padding: 5px 10px;
  color: red;
`;

const MessageContainer = styled.View<IMessageContainerProps>`
  flex-direction: ${(props: IMessageContainerProps) =>
    props.isMine ? "row-reverse" : "row"};
  align-items: center;
  padding: 0px 10px;
`;
const Author = styled.View``;

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

export default function MessageItem({ message, index }: IMessageItemProps) {
  const [lastRead, setLastRead] = useState(false);

  // useEffect(()=>{
  //   if(lastRead)
  // }, [])

  return (
    <MessageWrapper>
      {!lastRead ? (
        <LastReadSeparatorContainer>
          <LastReadSeparator />
          <LastReadText>Last Read</LastReadText>
          <LastReadSeparator />
        </LastReadSeparatorContainer>
      ) : null}
      <MessageContainer isMine={message.isMine}>
        <Author>
          <Avatar size="small" avatarUrl={message.user.avatar} />
        </Author>
        <MessageText>{message.payload}</MessageText>
      </MessageContainer>
    </MessageWrapper>
  );
}
