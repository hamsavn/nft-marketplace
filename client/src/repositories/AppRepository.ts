import { GetHomepageQuery, GetHomepageQueryVariables } from '@generated/graphql';

import Repository from './Repository';
import homepageQuery from '@graphql/queries/homepage.graphql';

export default {
  async getHomepage() {
    const { data } = await Repository.mutation<GetHomepageQuery, GetHomepageQueryVariables>({
      mutation: homepageQuery,
    });
    return data;
  },
};
