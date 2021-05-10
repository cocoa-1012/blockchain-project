import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { offsetLimitPagination } from '@apollo/client/utilities';

import { getSubgraphApi } from 'lib/subgraphApi';

import hasuraSplitLink from './apollo-hasura';

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
const graphEndpoint = getSubgraphApi(chainId);

const graphLink = new HttpLink({
  uri: graphEndpoint,
});

const serverEndpoint = new URL('graphql', process.env.NEXT_PUBLIC_SERVER_URL);

const serverLink = new HttpLink({
  uri: serverEndpoint.href,
});

const authLink = setContext((_, { token }) => {
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const hasuraOrGraphSplitLink = ApolloLink.split(
  (operation) => operation.getContext().endpoint === 'subgraph',
  graphLink,
  hasuraSplitLink
);

export const apolloClient = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().endpoint === 'server',
    authLink.concat(serverLink),
    hasuraOrGraphSplitLink
  ),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: ['publicKey'],
      },
      Query: {
        fields: {
          user: offsetLimitPagination(),
          creators: offsetLimitPagination(),
        },
      },
    },
  }),
});
