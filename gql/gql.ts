/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation toggleLike($id: Int!) {\n    toggleLike(id: $id) {\n      ok\n      error\n    }\n  }\n": types.ToggleLikeDocument,
    "\n  fragment PhotoFragment on Photo {\n    id\n    file\n    likes\n    commentCount\n    isLiked\n    caption\n    createdAt\n    isMine\n  }\n": types.PhotoFragmentFragmentDoc,
    "\n  fragment CommentFragment on Comment {\n    id\n    payload\n    isMine\n    createdAt\n    user {\n      id\n      username\n      avatar\n    }\n  }\n": types.CommentFragmentFragmentDoc,
    "\n  fragment UserFragment on User {\n    id\n    username\n    avatar\n    isFollowing\n    isMe\n  }\n": types.UserFragmentFragmentDoc,
    "\n  query me {\n    me {\n      profile {\n        ...UserFragment\n      }\n    }\n  }\n": types.MeDocument,
    "\n  mutation createAccount(\n    $firstName: String!\n    $lastName: String!\n    $username: String!\n    $email: String!\n    $password: String!\n  ) {\n    createAccount(\n      firstName: $firstName\n      lastName: $lastName\n      username: $username\n      email: $email\n      password: $password\n    ) {\n      ok\n      error\n    }\n  }\n": types.CreateAccountDocument,
    "\n  query seeFeed($offset: Int) {\n    seeFeed(offset: $offset) {\n      ...PhotoFragment\n      user {\n        ...UserFragment\n      }\n      comments {\n        ...CommentFragment\n      }\n    }\n  }\n": types.SeeFeedDocument,
    "\n  query seePhotoLikes($photoId: Int!) {\n    seePhotoLikes(id: $photoId) {\n      ...UserFragment\n    }\n  }\n": types.SeePhotoLikesDocument,
    "\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ok\n      token\n      error\n    }\n  }\n": types.LoginDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation toggleLike($id: Int!) {\n    toggleLike(id: $id) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation toggleLike($id: Int!) {\n    toggleLike(id: $id) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PhotoFragment on Photo {\n    id\n    file\n    likes\n    commentCount\n    isLiked\n    caption\n    createdAt\n    isMine\n  }\n"): (typeof documents)["\n  fragment PhotoFragment on Photo {\n    id\n    file\n    likes\n    commentCount\n    isLiked\n    caption\n    createdAt\n    isMine\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CommentFragment on Comment {\n    id\n    payload\n    isMine\n    createdAt\n    user {\n      id\n      username\n      avatar\n    }\n  }\n"): (typeof documents)["\n  fragment CommentFragment on Comment {\n    id\n    payload\n    isMine\n    createdAt\n    user {\n      id\n      username\n      avatar\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserFragment on User {\n    id\n    username\n    avatar\n    isFollowing\n    isMe\n  }\n"): (typeof documents)["\n  fragment UserFragment on User {\n    id\n    username\n    avatar\n    isFollowing\n    isMe\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query me {\n    me {\n      profile {\n        ...UserFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query me {\n    me {\n      profile {\n        ...UserFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createAccount(\n    $firstName: String!\n    $lastName: String!\n    $username: String!\n    $email: String!\n    $password: String!\n  ) {\n    createAccount(\n      firstName: $firstName\n      lastName: $lastName\n      username: $username\n      email: $email\n      password: $password\n    ) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createAccount(\n    $firstName: String!\n    $lastName: String!\n    $username: String!\n    $email: String!\n    $password: String!\n  ) {\n    createAccount(\n      firstName: $firstName\n      lastName: $lastName\n      username: $username\n      email: $email\n      password: $password\n    ) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query seeFeed($offset: Int) {\n    seeFeed(offset: $offset) {\n      ...PhotoFragment\n      user {\n        ...UserFragment\n      }\n      comments {\n        ...CommentFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query seeFeed($offset: Int) {\n    seeFeed(offset: $offset) {\n      ...PhotoFragment\n      user {\n        ...UserFragment\n      }\n      comments {\n        ...CommentFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query seePhotoLikes($photoId: Int!) {\n    seePhotoLikes(id: $photoId) {\n      ...UserFragment\n    }\n  }\n"): (typeof documents)["\n  query seePhotoLikes($photoId: Int!) {\n    seePhotoLikes(id: $photoId) {\n      ...UserFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ok\n      token\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ok\n      token\n      error\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;