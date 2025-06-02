import { ApolloClient, InMemoryCache } from "@apollo/client";
import type { DefaultOptions } from "@apollo/client/core";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
  },
  query: {
    fetchPolicy: 'no-cache',
  },
};

const client = new ApolloClient({
    uri: 'https://bd.rretrocar.ge/graphql',
    cache: new InMemoryCache(),
    defaultOptions,
});
export default client;