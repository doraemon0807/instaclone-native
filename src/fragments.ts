import { graphql } from "./gql";

export const PHOTO_FRAGMENT = graphql(`
  fragment PhotoFragment on Photo {
    id
    file
    likes
    commentCount
    isLiked
    caption
    createdAt
    isMine
  }
`);

export const COMMENT_FRAGMENT = graphql(`
  fragment CommentFragment on Comment {
    id
    payload
    isMine
    createdAt
    user {
      id
      username
      avatar
    }
  }
`);

export const USER_FRAGMENT = graphql(`
  fragment UserFragment on User {
    id
    username
    avatar
    isFollowing
    isMe
  }
`);

export const ROOM_FRAGMENT = graphql(`
  fragment RoomFragment on Room {
    id
    updatedAt
    unreadTotal
    users {
      id
      avatar
      username
    }
  }
`);

export const MESSAGE_FRAGMENT = graphql(`
  fragment MessageFragment on Message {
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
    unreaders {
      id
      username
    }
  }
`);
