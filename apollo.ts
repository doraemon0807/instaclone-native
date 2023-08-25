import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

export const isLoggedInVar = makeVar(false);

const client = new ApolloClient({
  uri: "https://tasty-colts-beg.loca.lt/graphql",
  cache: new InMemoryCache(),
});

export default client;
