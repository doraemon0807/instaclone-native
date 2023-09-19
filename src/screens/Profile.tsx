import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { IThemeProps } from "../../styles";
import { StackParamList } from "../navigators/SharedStackNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { logUserOut } from "../../apollo";
import {
  ApolloCache,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client";
import useUser from "../hook/useUser";
import { graphql } from "../gql";
import { UnfollowUserMutation, User } from "../gql/graphql";
import Avatar from "../components/shared/Avatar";
import Separator from "../components/shared/Separator";
import Button, { SButton } from "../components/shared/Button";
import PhotoGallery from "../components/profile/PhotoGallery";

type Props = NativeStackScreenProps<StackParamList, "Profile">;

interface IPropsWithMe extends Props {
  myProfile?: boolean;
}

export type IPostModeParams = "posts" | "saved" | "tagged";

interface IUnfollowUserUpdateProps {
  data?: UnfollowUserMutation | null;
}

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`;

const ProfileContainer = styled.View`
  padding: 15px;
  flex-direction: row;
`;

const ProfileAvatar = styled.View`
  margin-right: 26px;
`;

const ProfileBody = styled.View``;

const ProfileInfo = styled.View`
  width: 100%;
`;
const ProfileInfoHeader = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ProfileUsername = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${(props: IThemeProps) => props.theme.fontColor};
`;
const ProfileActions = styled.View`
  flex-direction: row;
`;

const ProfileAction = styled.View`
  width: 100px;
  margin-right: 8px;
`;

const ProfileDetail = styled.View`
  flex-direction: column;
  margin-top: 15px;
`;

const ProfileName = styled.Text`
  font-weight: 500;
  margin-bottom: 4px;
  color: ${(props: IThemeProps) => props.theme.fontColor};
`;
const ProfileBio = styled.Text`
  max-width: 230px;
  max-height: 120px;
  color: ${(props: IThemeProps) => props.theme.fontColor};
`;

const ProfileStats = styled.View`
  margin: 14px 0px;
  flex-direction: row;
`;

const ProfileStat = styled.View`
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const ProfileStatNumber = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
  font-weight: 600;
  margin-bottom: 4px;
`;

const ProfileStatText = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
`;

const PhotoContainer = styled.View``;
const PhotoHeader = styled.View`
  width: 100%;
  flex-direction: row;
`;

const PhotoMode = styled.TouchableOpacity<{ $active: boolean }>`
  justify-content: center;
  flex: 1;
  padding: 16px 0px;
  border-top: 1px solid
    ${(props: any) => (props.$active ? props.theme.fontColor : "transparent")};
`;

const PhotoModeText = styled.Text`
  text-align: center;
  color: ${(props: IThemeProps) => props.theme.fontColor};
`;

const PhotoWrapper = styled.View``;

const SEE_PROFILE_QUERY = graphql(`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      ok
      error
      profile {
        ...UserFragment
        createdAt
        firstName
        lastName
        bio
        totalFollowing
        totalFollowers
        photoCount
        fullName
        photos {
          ...PhotoFragment
        }
        savedPhotos {
          ...PhotoFragment
        }
        taggedPhotos {
          ...PhotoFragment
        }
      }
    }
  }
`);

const FOLLOW_USER_MUTATION = graphql(`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      error
    }
  }
`);

const UNFOLLOW_USER_MUTATION = graphql(`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
      error
    }
  }
`);

export default function Profile({
  navigation,
  route,
  myProfile,
}: IPropsWithMe) {
  useEffect(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: route?.params?.username,
      });
    }
  }, [route]);

  //grab userData of logged in user
  const { data: userData } = useUser();

  const username = myProfile
    ? userData?.me.profile?.username
    : route?.params?.username;

  //Apollo client allows you to access cache
  const client = useApolloClient();

  //query function to fetch profile info
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: username!,
    },
  });

  //function to update followUser cache
  //method 1: update
  const followUserUpdate = (
    cache: ApolloCache<User>,
    result: IUnfollowUserUpdateProps
  ) => {
    if (!result.data) {
      return;
    }
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;
    if (!ok) {
      return;
    }
    //modify cache of the profile user
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });

    //modify cache of the logged in user
    if (!userData?.me.profile) {
      return;
    }
    const {
      me: {
        profile: { username: myUsername },
      },
    } = userData;

    cache.modify({
      id: `User:${myUsername}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };

  // mutation function for following user
  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      username: username!,
    },
    update: followUserUpdate,
  });

  //function to update unfollowUser cache
  //method 2: onCompleted + Apollo client
  const unfollowUserCompleted = (data: any) => {
    const {
      followUser: { ok },
    } = data;
    if (!ok) {
      return;
    }
    const { cache } = client;

    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });
    //modify cache of the logged in user
    if (!userData?.me.profile) {
      return;
    }
    const {
      me: {
        profile: { username: myUsername },
      },
    } = userData;

    cache.modify({
      id: `User:${myUsername}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };
  // mutation function for unfollowing user
  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      username: username!,
    },
    onCompleted: unfollowUserCompleted,
  });

  const onFollowClick = () => {
    unfollowUser();
  };

  const onUnfollowClick = () => {
    followUser();
  };

  //states to change modes for photo gallery
  const [postMode, setPostMode] = useState<IPostModeParams>("posts");

  return (
    <Container>
      <ProfileContainer>
        <ProfileAvatar>
          <Avatar avatarUrl={data?.seeProfile.profile?.avatar} size="large" />
        </ProfileAvatar>
        <ProfileBody>
          <ProfileInfo>
            <ProfileInfoHeader>
              <ProfileUsername>
                {data?.seeProfile.profile?.username}
              </ProfileUsername>
              {data?.seeProfile.profile?.isMe ? (
                <ProfileActions>
                  <ProfileAction>
                    <Button text="Edit Profile" />
                  </ProfileAction>
                  <ProfileAction>
                    <Button text="Log Out" onPress={() => logUserOut()} />
                  </ProfileAction>
                </ProfileActions>
              ) : (
                <ProfileActions>
                  {data?.seeProfile.profile?.isFollowing ? (
                    <ProfileAction>
                      <Button text="Followed" onPress={onFollowClick} />
                    </ProfileAction>
                  ) : (
                    <ProfileAction>
                      <Button text="Follow" $accent onPress={onUnfollowClick} />
                    </ProfileAction>
                  )}
                  <ProfileAction>
                    <Button text="Message" />
                  </ProfileAction>
                </ProfileActions>
              )}
            </ProfileInfoHeader>
          </ProfileInfo>
          <ProfileDetail>
            <ProfileName>{data?.seeProfile.profile?.fullName}</ProfileName>
            <ProfileBio>{data?.seeProfile.profile?.bio}</ProfileBio>
          </ProfileDetail>
        </ProfileBody>
      </ProfileContainer>
      <Separator />
      <ProfileStats>
        <ProfileStat>
          {data?.seeProfile.profile?.photoCount === 1 ? (
            <>
              <ProfileStatNumber>1</ProfileStatNumber>
              <ProfileStatText>post</ProfileStatText>
            </>
          ) : (
            <>
              <ProfileStatNumber>
                {data?.seeProfile.profile?.photoCount}
              </ProfileStatNumber>
              <ProfileStatText>post</ProfileStatText>
            </>
          )}
        </ProfileStat>
        <ProfileStat>
          {data?.seeProfile.profile?.totalFollowers === 1 ? (
            <>
              <ProfileStatNumber>1</ProfileStatNumber>
              <ProfileStatText>follower</ProfileStatText>
            </>
          ) : (
            <>
              <ProfileStatNumber>
                {data?.seeProfile.profile?.totalFollowers}
              </ProfileStatNumber>
              <ProfileStatText>followers</ProfileStatText>
            </>
          )}
        </ProfileStat>
        <ProfileStat>
          {data?.seeProfile.profile?.totalFollowing === 1 ? (
            <>
              <ProfileStatNumber>1</ProfileStatNumber>
              <ProfileStatText>following</ProfileStatText>
            </>
          ) : (
            <>
              <ProfileStatNumber>
                {data?.seeProfile.profile?.totalFollowing}
              </ProfileStatNumber>
              <ProfileStatText>followings</ProfileStatText>
            </>
          )}
        </ProfileStat>
      </ProfileStats>
      <Separator />
      <PhotoContainer>
        <PhotoHeader>
          <PhotoMode
            $active={postMode === "posts"}
            onPress={() => setPostMode("posts")}
          >
            <PhotoModeText>Posts</PhotoModeText>
          </PhotoMode>
          {data?.seeProfile.profile?.isMe && (
            <PhotoMode
              $active={postMode === "saved"}
              onPress={() => setPostMode("saved")}
            >
              <PhotoModeText>Saved</PhotoModeText>
            </PhotoMode>
          )}
          <PhotoMode
            $active={postMode === "tagged"}
            onPress={() => setPostMode("tagged")}
          >
            <PhotoModeText>Tagged</PhotoModeText>
          </PhotoMode>
        </PhotoHeader>
        <PhotoWrapper>
          {postMode === "posts" && data?.seeProfile.profile?.photos && (
            <PhotoGallery
              mode={postMode}
              isMe={data?.seeProfile.profile?.isMe}
              photos={data.seeProfile.profile.photos}
            />
          )}
          {postMode === "saved" && data?.seeProfile.profile?.savedPhotos && (
            <PhotoGallery
              mode={postMode}
              isMe={data?.seeProfile.profile?.isMe}
              photos={data.seeProfile.profile.savedPhotos}
            />
          )}
          {postMode === "tagged" && data?.seeProfile.profile?.taggedPhotos && (
            <PhotoGallery
              mode={postMode}
              isMe={data?.seeProfile.profile?.isMe}
              photos={data.seeProfile.profile.taggedPhotos}
            />
          )}
        </PhotoWrapper>
      </PhotoContainer>
      {/* 
      
      <PhotoContainer>
        <PhotoHeader>
          <PhotoMode
            $active={postMode === "posts"}
            onClick={() => setPostMode("posts")}
          >
            <PhotoModeText>Posts</PhotoModeText>
          </PhotoMode>
          {data?.seeProfile.profile?.isMe && (
            <PhotoMode
              $active={postMode === "saved"}
              onClick={() => setPostMode("saved")}
            >
              <PhotoModeText>Saved</PhotoModeText>
            </PhotoMode>
          )}
          <PhotoMode
            $active={postMode === "tagged"}
            onClick={() => setPostMode("tagged")}
          >
            <PhotoModeText>Tagged</PhotoModeText>
          </PhotoMode>
        </PhotoHeader>
        <PhotoWrapper>
          {postMode === "posts" && data?.seeProfile.profile?.photos && (
            <PhotoGallery
              mode={postMode}
              isMe={data?.seeProfile.profile?.isMe}
              photos={data.seeProfile.profile.photos}
            />
          )}
          {postMode === "saved" && data?.seeProfile.profile?.savedPhotos && (
            <PhotoGallery
              mode={postMode}
              isMe={data?.seeProfile.profile?.isMe}
              photos={data.seeProfile.profile.savedPhotos}
            />
          )}
          {postMode === "tagged" && data?.seeProfile.profile?.taggedPhotos && (
            <PhotoGallery
              mode={postMode}
              isMe={data?.seeProfile.profile?.isMe}
              photos={data.seeProfile.profile.taggedPhotos}
            />
          )}
        </PhotoWrapper>
      </PhotoContainer> */}
    </Container>
  );
}
