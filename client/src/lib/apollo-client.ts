import { ApolloLink, ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { getMainDefinition } from 'apollo-utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import Url from 'url-parse';
import { createUploadLink } from 'apollo-upload-client';

const isSSR = typeof window === 'undefined';
const isProd = !!process.env.PROD;

const graphqlUri = isSSR ? process.env.API_ENDPOINT : `${window.location.origin}/graphql`;

const url = new Url(process.env.API_ENDPOINT, true);

function createLink() {
  const httpLink = createUploadLink({
    uri: graphqlUri,
    credentials: 'include',
  });

  if (isSSR) {
    return httpLink;
  }

  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${isProd ? 'wss' : 'ws'}://${url.host}${url.pathname}`,
    }),
  );

  const link = ApolloLink.split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query) as any;
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  );

  return link;
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: isSSR,
    link: createLink(),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });
}

export function initializeApollo(initialState: any = null) {
  let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

  // Create new client for each ssr request
  if (!apolloClient || isSSR) {
    apolloClient = createApolloClient();
  }

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    apolloClient.cache.restore(initialState);
  }

  return apolloClient;
}
