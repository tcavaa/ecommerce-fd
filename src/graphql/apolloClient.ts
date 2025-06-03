import { ApolloClient, InMemoryCache } from "@apollo/client";
import type { DefaultOptions } from "@apollo/client/core";
import { API_CONFIG } from '../constants/index';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
  },
  query: {
    fetchPolicy: 'no-cache',
  },
};

const client = new ApolloClient({
    uri: API_CONFIG.GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
});
export default client;