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
    "\n  fragment RoomFragment on Room {\n    id\n    updatedAt\n    unreadTotal\n    users {\n      id\n      avatar\n      username\n    }\n  }\n": types.RoomFragmentFragmentDoc,
    "\n  fragment MessageFragment on Message {\n    id\n    payload\n    readByMe\n    readByAll\n    isMine\n    user {\n      id\n      username\n      avatar\n    }\n    unreaders {\n      id\n      username\n    }\n  }\n": types.MessageFragmentFragmentDoc,
    "\n  query me {\n    me {\n      profile {\n        ...UserFragment\n        firstName\n        lastName\n        email\n        bio\n      }\n    }\n  }\n": types.MeDocument,
    "\n  mutation createAccount(\n    $firstName: String!\n    $lastName: String!\n    $username: String!\n    $email: String!\n    $password: String!\n  ) {\n    createAccount(\n      firstName: $firstName\n      lastName: $lastName\n      username: $username\n      email: $email\n      password: $password\n    ) {\n      ok\n      error\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation editProfile(\n    $firstName: String\n    $lastName: String\n    $username: String\n    $email: String\n    $bio: String\n  ) {\n    editProfile(\n      firstName: $firstName\n      lastName: $lastName\n      username: $username\n      email: $email\n      bio: $bio\n    ) {\n      ok\n    }\n  }\n": types.EditProfileDocument,
    "\n  query seeFeed($offset: Int) {\n    seeFeed(offset: $offset) {\n      ...PhotoFragment\n      user {\n        ...UserFragment\n      }\n      comments {\n        ...CommentFragment\n      }\n    }\n  }\n": types.SeeFeedDocument,
    "\n  query seePhotoLikes($photoId: Int!) {\n    seePhotoLikes(id: $photoId) {\n      ...UserFragment\n    }\n  }\n": types.SeePhotoLikesDocument,
    "\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ok\n      token\n      error\n    }\n  }\n": types.LoginDocument,
    "\n  query seeRoom($id: Int!) {\n    seeRoom(id: $id) {\n      id\n      messages {\n        ...MessageFragment\n      }\n    }\n  }\n": types.SeeRoomDocument,
    "\n  mutation sendMessage($payload: String!, $roomId: Int, $userIds: [Int]) {\n    sendMessage(payload: $payload, roomId: $roomId, userIds: $userIds) {\n      ok\n      error\n      id\n    }\n  }\n": types.SendMessageDocument,
    "\n  mutation readMessage($id: Int!) {\n    readMessage(id: $id) {\n      ok\n      error\n      id\n    }\n  }\n": types.ReadMessageDocument,
    "\n  subscription roomUpdate($id: Int!) {\n    roomUpdate(id: $id) {\n      ...MessageFragment\n    }\n  }\n": types.RoomUpdateDocument,
    "\n          fragment fakeMessage on Message {\n            id\n            payload\n            readByAll\n            isMine\n            readByMe\n            user {\n              id\n              username\n              avatar\n            }\n          }\n        ": types.FakeMessageFragmentDoc,
    "\n  query seeRooms {\n    seeRooms {\n      ...RoomFragment\n    }\n  }\n": types.SeeRoomsDocument,
    "\n  query seePhoto($photoId: Int!) {\n    seePhoto(id: $photoId) {\n      ...PhotoFragment\n      user {\n        ...UserFragment\n      }\n      comments {\n        ...CommentFragment\n      }\n    }\n  }\n": types.SeePhotoDocument,
    "\n  query seeProfile($username: String!) {\n    seeProfile(username: $username) {\n      ok\n      error\n      profile {\n        ...UserFragment\n        createdAt\n        firstName\n        lastName\n        bio\n        totalFollowing\n        totalFollowers\n        photoCount\n        fullName\n        photos {\n          ...PhotoFragment\n        }\n        savedPhotos {\n          ...PhotoFragment\n        }\n        taggedPhotos {\n          ...PhotoFragment\n        }\n      }\n    }\n  }\n": types.SeeProfileDocument,
    "\n  mutation followUser($username: String!) {\n    followUser(username: $username) {\n      ok\n      error\n    }\n  }\n": types.FollowUserDocument,
    "\n  mutation unfollowUser($username: String!) {\n    unfollowUser(username: $username) {\n      ok\n      error\n    }\n  }\n": types.UnfollowUserDocument,
    "\n  query searchPhotos($keyword: String!, $offset: Int) {\n    searchPhotos(keyword: $keyword, offset: $offset) {\n      id\n      file\n    }\n  }\n": types.SearchPhotosDocument,
    "\n  mutation uploadPhoto($file: Upload!, $caption: String) {\n    uploadPhoto(file: $file, caption: $caption) {\n      ok\n      error\n      photo {\n        ...PhotoFragment\n        user {\n          ...UserFragment\n        }\n      }\n    }\n  }\n": types.UploadPhotoDocument,
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
export function graphql(source: "\n  fragment RoomFragment on Room {\n    id\n    updatedAt\n    unreadTotal\n    users {\n      id\n      avatar\n      username\n    }\n  }\n"): (typeof documents)["\n  fragment RoomFragment on Room {\n    id\n    updatedAt\n    unreadTotal\n    users {\n      id\n      avatar\n      username\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MessageFragment on Message {\n    id\n    payload\n    readByMe\n    readByAll\n    isMine\n    user {\n      id\n      username\n      avatar\n    }\n    unreaders {\n      id\n      username\n    }\n  }\n"): (typeof documents)["\n  fragment MessageFragment on Message {\n    id\n    payload\n    readByMe\n    readByAll\n    isMine\n    user {\n      id\n      username\n      avatar\n    }\n    unreaders {\n      id\n      username\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query me {\n    me {\n      profile {\n        ...UserFragment\n        firstName\n        lastName\n        email\n        bio\n      }\n    }\n  }\n"): (typeof documents)["\n  query me {\n    me {\n      profile {\n        ...UserFragment\n        firstName\n        lastName\n        email\n        bio\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createAccount(\n    $firstName: String!\n    $lastName: String!\n    $username: String!\n    $email: String!\n    $password: String!\n  ) {\n    createAccount(\n      firstName: $firstName\n      lastName: $lastName\n      username: $username\n      email: $email\n      password: $password\n    ) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createAccount(\n    $firstName: String!\n    $lastName: String!\n    $username: String!\n    $email: String!\n    $password: String!\n  ) {\n    createAccount(\n      firstName: $firstName\n      lastName: $lastName\n      username: $username\n      email: $email\n      password: $password\n    ) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editProfile(\n    $firstName: String\n    $lastName: String\n    $username: String\n    $email: String\n    $bio: String\n  ) {\n    editProfile(\n      firstName: $firstName\n      lastName: $lastName\n      username: $username\n      email: $email\n      bio: $bio\n    ) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation editProfile(\n    $firstName: String\n    $lastName: String\n    $username: String\n    $email: String\n    $bio: String\n  ) {\n    editProfile(\n      firstName: $firstName\n      lastName: $lastName\n      username: $username\n      email: $email\n      bio: $bio\n    ) {\n      ok\n    }\n  }\n"];
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query seeRoom($id: Int!) {\n    seeRoom(id: $id) {\n      id\n      messages {\n        ...MessageFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query seeRoom($id: Int!) {\n    seeRoom(id: $id) {\n      id\n      messages {\n        ...MessageFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation sendMessage($payload: String!, $roomId: Int, $userIds: [Int]) {\n    sendMessage(payload: $payload, roomId: $roomId, userIds: $userIds) {\n      ok\n      error\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation sendMessage($payload: String!, $roomId: Int, $userIds: [Int]) {\n    sendMessage(payload: $payload, roomId: $roomId, userIds: $userIds) {\n      ok\n      error\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation readMessage($id: Int!) {\n    readMessage(id: $id) {\n      ok\n      error\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation readMessage($id: Int!) {\n    readMessage(id: $id) {\n      ok\n      error\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription roomUpdate($id: Int!) {\n    roomUpdate(id: $id) {\n      ...MessageFragment\n    }\n  }\n"): (typeof documents)["\n  subscription roomUpdate($id: Int!) {\n    roomUpdate(id: $id) {\n      ...MessageFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          fragment fakeMessage on Message {\n            id\n            payload\n            readByAll\n            isMine\n            readByMe\n            user {\n              id\n              username\n              avatar\n            }\n          }\n        "): (typeof documents)["\n          fragment fakeMessage on Message {\n            id\n            payload\n            readByAll\n            isMine\n            readByMe\n            user {\n              id\n              username\n              avatar\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query seeRooms {\n    seeRooms {\n      ...RoomFragment\n    }\n  }\n"): (typeof documents)["\n  query seeRooms {\n    seeRooms {\n      ...RoomFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query seePhoto($photoId: Int!) {\n    seePhoto(id: $photoId) {\n      ...PhotoFragment\n      user {\n        ...UserFragment\n      }\n      comments {\n        ...CommentFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query seePhoto($photoId: Int!) {\n    seePhoto(id: $photoId) {\n      ...PhotoFragment\n      user {\n        ...UserFragment\n      }\n      comments {\n        ...CommentFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query seeProfile($username: String!) {\n    seeProfile(username: $username) {\n      ok\n      error\n      profile {\n        ...UserFragment\n        createdAt\n        firstName\n        lastName\n        bio\n        totalFollowing\n        totalFollowers\n        photoCount\n        fullName\n        photos {\n          ...PhotoFragment\n        }\n        savedPhotos {\n          ...PhotoFragment\n        }\n        taggedPhotos {\n          ...PhotoFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query seeProfile($username: String!) {\n    seeProfile(username: $username) {\n      ok\n      error\n      profile {\n        ...UserFragment\n        createdAt\n        firstName\n        lastName\n        bio\n        totalFollowing\n        totalFollowers\n        photoCount\n        fullName\n        photos {\n          ...PhotoFragment\n        }\n        savedPhotos {\n          ...PhotoFragment\n        }\n        taggedPhotos {\n          ...PhotoFragment\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation followUser($username: String!) {\n    followUser(username: $username) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation followUser($username: String!) {\n    followUser(username: $username) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation unfollowUser($username: String!) {\n    unfollowUser(username: $username) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation unfollowUser($username: String!) {\n    unfollowUser(username: $username) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchPhotos($keyword: String!, $offset: Int) {\n    searchPhotos(keyword: $keyword, offset: $offset) {\n      id\n      file\n    }\n  }\n"): (typeof documents)["\n  query searchPhotos($keyword: String!, $offset: Int) {\n    searchPhotos(keyword: $keyword, offset: $offset) {\n      id\n      file\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation uploadPhoto($file: Upload!, $caption: String) {\n    uploadPhoto(file: $file, caption: $caption) {\n      ok\n      error\n      photo {\n        ...PhotoFragment\n        user {\n          ...UserFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation uploadPhoto($file: Upload!, $caption: String) {\n    uploadPhoto(file: $file, caption: $caption) {\n      ok\n      error\n      photo {\n        ...PhotoFragment\n        user {\n          ...UserFragment\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;