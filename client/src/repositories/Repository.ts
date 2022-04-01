import { QueryOptions, MutationOptions, SubscriptionOptions } from '@apollo/client';
import { initializeApollo } from '@lib/apollo-client';

export default {
  async query<T, Variables>(args: QueryOptions<Variables>) {
    // init client for each request due to ssr
    const apolloClient = initializeApollo();
    return apolloClient.query<T, Variables>({ ...args, fetchPolicy: 'no-cache' });
  },

  async mutation<T, Variables>(args: MutationOptions<T, Variables>) {
    // init client for each request due to ssr
    const apolloClient = initializeApollo();
    return apolloClient.mutate<T, Variables>({ ...args });
  },

  async subscribe<T, Variables>(args: SubscriptionOptions<Variables>) {
    // init client for each request due to ssr
    const apolloClient = initializeApollo();
    return apolloClient.subscribe<T, Variables>({ ...args });
  },
};
