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
