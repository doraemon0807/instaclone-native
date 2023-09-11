import React from "react";
import Avatar from "../shared/Avatar";
import { Message } from "../../gql/graphql";
import styled from "styled-components/native";
import { IThemeProps } from "../../../styles";

interface IMessageItemProps {
  message: Message;
}

interface IMessageContainerProps {
  isMine: boolean;
}

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

export default function MessageItem({ message }: IMessageItemProps) {
  return (
    <MessageContainer isMine={message.isMine}>
      <Author>
        <Avatar size="small" avatarUrl={message.user.avatar} />
      </Author>
      <MessageText>{message.payload}</MessageText>
    </MessageContainer>
  );
}
