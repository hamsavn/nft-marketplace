import {
  GetUserQuery,
  GetUserQueryVariables,
  CreateAuthMutation,
  CreateAuthMutationVariables,
  CreateAuthInput,
  GetNonceQuery,
  GetNonceQueryVariables,
  ProfileUpdateSubscription,
  ProfileUpdateSubscriptionVariables,
  LogoutMutation,
  LogoutMutationVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UpdateUserInput,
  CheckLoginQuery,
  CheckLoginQueryVariables,
} from '@generated/graphql';

import getUserQuery from '@graphql/queries/user.graphql';
import profileSubScription from '@graphql/subscriptions/profile.graphql';
import Repository from './Repository';
import createAuthMutation from '@graphql/mutations/createAuth.graphql';
import getNonce from '@graphql/queries/getNonce.graphql';
import logoutMutation from '@graphql/mutations/logout.graphql';
import updateUserMutation from '@graphql/mutations/updateUser.graphql';
import checkLogin from '@graphql/queries/checkLogin.graphql';

export default {
  async getuser(address: string) {
    const { data } = await Repository.query<GetUserQuery, GetUserQueryVariables>({
      query: getUserQuery,
      variables: {
        address,
      },
    });

    return data;
  },

  async createAuth(input: CreateAuthInput): Promise<string> {
    const { data } = await Repository.mutation<CreateAuthMutation, CreateAuthMutationVariables>({
      mutation: createAuthMutation,
      variables: {
        input,
      },
    });

    return data.createAuth.token;
  },

  async getNonce(address: string): Promise<string> {
    const { data } = await Repository.query<GetNonceQuery, GetNonceQueryVariables>({
      query: getNonce,
      variables: {
        address,
      },
    });

    return data.getNonce;
  },

  async subsribeProfileUpdate() {
    const data = await Repository.subscribe<
      ProfileUpdateSubscription,
      ProfileUpdateSubscriptionVariables
    >({
      query: profileSubScription,
    });

    data.subscribe((value) => {
      console.log(value.data.profileUpdated.address);
    });
  },

  async logout(): Promise<boolean> {
    const { data } = await Repository.mutation<LogoutMutation, LogoutMutationVariables>({
      mutation: logoutMutation,
    });

    return data.logout;
  },

  async updateUser(input: UpdateUserInput) {
    const { data } = await Repository.mutation<UpdateUserMutation, UpdateUserMutationVariables>({
      mutation: updateUserMutation,
      variables: {
        input,
      },
    });

    return data.updateUser;
  },

  async checkLogin(): Promise<boolean> {
    const { data } = await Repository.query<CheckLoginQuery, CheckLoginQueryVariables>({
      query: checkLogin,
      variables: {},
    });

    return data.checkLogin;
  },
};
