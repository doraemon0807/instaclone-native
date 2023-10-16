import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  createHttpLink,
  makeVar,
  split,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "@apollo/client/link/ws";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar<string | null>("");
export const darkModeVar = makeVar(false);

const TOKEN = "token";

export const logUserIn = async (token: string) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
  client.resetStore();
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar(null);
};

//http link to authenticate with token
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

//http link to upload files
const uploadHttpLink = createUploadLink({
  uri: "https://witty-ants-find.loca.lt/graphql",
});

//http link to display errors
const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`GraphQL Error: `, graphQLErrors);
  }
  if (networkError) {
    console.log(`GraphQL Error: `, networkError);
  }
});

//http links combined
const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://witty-ants-find.loca.lt/graphql",
    connectionParams: () => ({
      token: tokenVar(),
    }),
  })
);

//split function to choose either ws or http depending on the operation
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinks
);

//cache configured to have offsetLimitPagination for seeFeed query
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
      },
    },
    Room: {
      fields: {
        messages: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    User: {
      keyFields: (obj) => `User:${obj.username}`,
    },
  },
});

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
