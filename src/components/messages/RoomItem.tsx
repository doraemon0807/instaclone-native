import React from "react";
import styled from "styled-components/native";
import { IThemeProps } from "../../../styles";
import { Room, User } from "../../gql/graphql";
import useUser from "../../hook/useUser";
import Avatar from "../shared/Avatar";
import { TextProps, TouchableOpacityProps } from "react-native";
import { MessagesNavStackParamList } from "../../navigators/MessagesNav";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const RoomContainer: React.FC<TouchableOpacityProps> = styled.TouchableOpacity`
  width: 100%;
  padding: 15px 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const Data = styled.View`
  margin-left: 20px;
`;

const ParticipantInfo = styled.View`
  flex-direction: row;
`;

const ParticipantCount = styled.Text`
  margin-left: 10px;
  color: ${(props: IThemeProps) => props.theme.grayNormal};
`;

const Username: React.FC<TextProps> = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
  font-weight: 600;
  font-size: 14px;
`;
const UnreadText = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
  margin-top: 2px;
  font-weight: 600;
`;
const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 10px;
  background-color: ${(props: IThemeProps) => props.theme.red};
`;

interface IRoomItemProps {
  id: number;
  users: User[] | null;
  unreadTotal: number;
}

export default function RoomItem({ users, unreadTotal, id }: IRoomItemProps) {
  const { data } = useUser();

  const navigation: NativeStackNavigationProp<
    MessagesNavStackParamList,
    "MessageRooms",
    undefined
  > = useNavigation();

  //find users in the room that is not me
  const opponents = users?.filter(
    (user) => user?.username !== data?.me.profile?.username
  );
  const opponent = opponents?.[0];

  const opponentsNameGen = () => {
    let names = "";
    opponents?.map((opponent, index) => {
      if (index === 0) {
        names = opponent.username;
      } else {
        names = `${names}, ${opponent.username}`;
      }
    });
    return names;
  };

  const opponentsNames = opponentsNameGen();

  const goToRoom = () => {
    navigation.navigate("MessageRoom", {
      id,
      opponents,
    });
  };

  return (
    <RoomContainer onPress={goToRoom}>
      <Column>
        <Avatar avatarUrl={opponent?.avatar} style={{ marginRight: 10 }} />
        <Data>
          <ParticipantInfo>
            <Username ellipsizeMode="tail" numberOfLines={1}>
              {opponentsNames}
            </Username>
            <ParticipantCount>
              {opponents?.length && opponents?.length + 1}
            </ParticipantCount>
          </ParticipantInfo>
          {unreadTotal !== 0 && (
            <UnreadText>
              {unreadTotal} unread {unreadTotal === 1 ? "message" : "messages"}
            </UnreadText>
          )}
        </Data>
      </Column>
      <Column>{unreadTotal !== 0 && <UnreadDot />}</Column>
    </RoomContainer>
  );
}
