import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";
import { SButtonText } from "../shared/Button";
import { StackParamList } from "../../navigators/SharedStackNav";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Avatar from "../shared/Avatar";

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px;
`;
const Column: React.FC<TouchableOpacityProps> = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Username = styled.Text`
  font-weight: 600;
  color: white;
  margin-left: 10px;
`;

const FollowBtn = styled.TouchableOpacity<{ isFollowing: boolean }>`
  background-color: ${(props: any) =>
    !props.isFollowing ? props.theme.accentNormal : props.theme.grayNormal};
  padding: 8px;
  border-radius: 7px;
  justify-content: center;
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? "0.5" : "1")};
`;

const FollowBtnText = styled(SButtonText)`
  color: white;
  font-weight: 600;
`;

export interface IUserRowProps {
  id: number;
  avatar: string;
  username: string;
  isFollowing: boolean;
  isMe: boolean;
  navigation: NativeStackNavigationProp<StackParamList, "Likes", undefined>;
}

export default function UserRow({
  id,
  avatar,
  username,
  isFollowing,
  isMe,
  navigation,
}: IUserRowProps) {
  return (
    <Wrapper>
      <Column
        onPress={() =>
          navigation.navigate("Profile", {
            username,
            id,
          })
        }
      >
        <Avatar avatarUrl={avatar} />
        <Username>{username}</Username>
      </Column>
      {!isMe ? (
        <FollowBtn isFollowing={isFollowing}>
          <FollowBtnText>{isFollowing ? "Followed" : "Follow"}</FollowBtnText>
        </FollowBtn>
      ) : null}
    </Wrapper>
  );
}
