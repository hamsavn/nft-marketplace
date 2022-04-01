import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Auth = {
  __typename?: 'Auth';
  token: Scalars['String'];
};

export type CreateAuthInput = {
  address: Scalars['String'];
  signature: Scalars['String'];
};

export type CreateMetadataInput = {
  description: Scalars['String'];
  media: Scalars['Upload'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAuth: Auth;
  createMetadata: Scalars['String'];
  createUser: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  updateMetadata: Scalars['String'];
  updateUser: User;
};


export type MutationCreateAuthArgs = {
  createAuthInput: CreateAuthInput;
};


export type MutationCreateMetadataArgs = {
  input: CreateMetadataInput;
};


export type MutationCreateUserArgs = {
  address: Scalars['String'];
};


export type MutationUpdateMetadataArgs = {
  input: UpdateMetadataInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Nft = {
  __typename?: 'Nft';
  createdAt: Scalars['String'];
  creator: User;
  description: Scalars['String'];
  fileURL: Scalars['String'];
  id: Scalars['String'];
  mediaHeight: Scalars['Int'];
  mediaWidth: Scalars['Int'];
  owner: User;
  price?: Maybe<Scalars['Float']>;
  status: Scalars['String'];
  title: Scalars['String'];
  tokenId?: Maybe<Scalars['Int']>;
  tokenURI: Scalars['String'];
  tradingHistory: Array<TradingHistory>;
  updatedAt: Scalars['String'];
  views: Scalars['Int'];
};

export type NftDelistingResponse = {
  __typename?: 'NftDelistingResponse';
  hashTransaction: Scalars['String'];
};

export type NftMintedResponse = {
  __typename?: 'NftMintedResponse';
  nftId: Scalars['String'];
  nftMinted: Scalars['String'];
};

export type NftQueryParams = {
  creator?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  pagination: Pagination;
  search?: InputMaybe<Scalars['String']>;
};

export type NftResponse = {
  __typename?: 'NftResponse';
  items: Array<Nft>;
  total: Scalars['Int'];
};

export type NftSetTokenUriResponse = {
  __typename?: 'NftSetTokenUriResponse';
  nftId: Scalars['String'];
  tokenURI: Scalars['String'];
};

export type NftStats = {
  __typename?: 'NftStats';
  total: Scalars['Int'];
  totalArtist: Scalars['Int'];
};

export type Pagination = {
  page: Scalars['Int'];
  perPage: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  checkLogin: Scalars['Boolean'];
  getNonce: Scalars['String'];
  newItems: Array<Nft>;
  nft: NftResponse;
  nftDetail: Nft;
  stats: NftStats;
  topSellers: Array<User>;
  user?: Maybe<User>;
};


export type QueryGetNonceArgs = {
  address: Scalars['String'];
};


export type QueryNftArgs = {
  input: NftQueryParams;
};


export type QueryNftDetailArgs = {
  id: Scalars['String'];
};


export type QueryUserArgs = {
  address: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  nftBuying: NftDelistingResponse;
  nftDelisting: NftDelistingResponse;
  nftListing: NftDelistingResponse;
  nftMinted: NftMintedResponse;
  nftSetTokenURI: NftSetTokenUriResponse;
  profileUpdated: User;
};

export type TradingHistory = {
  __typename?: 'TradingHistory';
  createdAt: Scalars['String'];
  event: Scalars['String'];
  from: Scalars['String'];
  id: Scalars['String'];
  nftId: Scalars['String'];
  price: Scalars['Float'];
  to: Scalars['String'];
};

export type UpdateMetadataInput = {
  description?: InputMaybe<Scalars['String']>;
  ipfsHash: Scalars['String'];
  media?: InputMaybe<Scalars['Upload']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  bio?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  instaName?: InputMaybe<Scalars['String']>;
  profileBanner?: InputMaybe<Scalars['String']>;
  profileImage?: InputMaybe<Scalars['Upload']>;
  socialLink?: InputMaybe<Scalars['String']>;
  twitterName?: InputMaybe<Scalars['String']>;
  userName?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  /** Wallet address */
  address: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  instaName?: Maybe<Scalars['String']>;
  profileBanner?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  socialLink?: Maybe<Scalars['String']>;
  totalSales: Scalars['Int'];
  twitterName?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
};

export type CreateAuthMutationVariables = Exact<{
  input: CreateAuthInput;
}>;


export type CreateAuthMutation = { __typename?: 'Mutation', createAuth: { __typename?: 'Auth', token: string } };

export type CreateMetadataMutationVariables = Exact<{
  input: CreateMetadataInput;
}>;


export type CreateMetadataMutation = { __typename?: 'Mutation', createMetadata: string };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type UpdateMetadataMutationVariables = Exact<{
  input: UpdateMetadataInput;
}>;


export type UpdateMetadataMutation = { __typename?: 'Mutation', updateMetadata: string };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', address: string } };

export type CheckLoginQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckLoginQuery = { __typename?: 'Query', checkLogin: boolean };

export type GetNonceQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type GetNonceQuery = { __typename?: 'Query', getNonce: string };

export type GetHomepageQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHomepageQuery = { __typename?: 'Query', stats: { __typename?: 'NftStats', total: number, totalArtist: number }, topSellers: Array<{ __typename?: 'User', totalSales: number, address: string, profileImage?: string | null, userName?: string | null }>, newItems: Array<{ __typename?: 'Nft', id: string, title: string, fileURL: string, price?: number | null, creator: { __typename?: 'User', profileImage?: string | null, address: string }, owner: { __typename?: 'User', profileImage?: string | null, address: string } }> };

export type GetNftsQueryVariables = Exact<{
  params: NftQueryParams;
}>;


export type GetNftsQuery = { __typename?: 'Query', nft: { __typename?: 'NftResponse', total: number, items: Array<{ __typename?: 'Nft', id: string, title: string, fileURL: string, price?: number | null, mediaHeight: number, mediaWidth: number, creator: { __typename?: 'User', profileImage?: string | null, address: string }, owner: { __typename?: 'User', profileImage?: string | null, address: string } }> } };

export type NftDetailQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type NftDetailQuery = { __typename?: 'Query', nftDetail: { __typename?: 'Nft', id: string, tokenURI: string, title: string, description: string, fileURL: string, status: string, mediaHeight: number, mediaWidth: number, price?: number | null, tokenId?: number | null, creator: { __typename?: 'User', address: string, createdAt: string, email?: string | null, bio?: string | null, socialLink?: string | null, userName?: string | null, profileImage?: string | null, profileBanner?: string | null, twitterName?: string | null, instaName?: string | null }, owner: { __typename?: 'User', address: string, userName?: string | null, profileImage?: string | null, createdAt: string }, tradingHistory: Array<{ __typename?: 'TradingHistory', id: string, event: string, price: number, from: string, to: string, createdAt: string, nftId: string }> } };

export type GetUserQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', checkLogin: boolean, user?: { __typename?: 'User', address: string, createdAt: string, email?: string | null, bio?: string | null, socialLink?: string | null, userName?: string | null, profileImage?: string | null, profileBanner?: string | null, twitterName?: string | null, instaName?: string | null, totalSales: number } | null };

export type NftBuyingSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NftBuyingSubscription = { __typename?: 'Subscription', nftBuying: { __typename?: 'NftDelistingResponse', hashTransaction: string } };

export type NftDelistingSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NftDelistingSubscription = { __typename?: 'Subscription', nftDelisting: { __typename?: 'NftDelistingResponse', hashTransaction: string } };

export type NftListingSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NftListingSubscription = { __typename?: 'Subscription', nftListing: { __typename?: 'NftDelistingResponse', hashTransaction: string } };

export type NftMintedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NftMintedSubscription = { __typename?: 'Subscription', nftMinted: { __typename?: 'NftMintedResponse', nftMinted: string, nftId: string } };

export type NftSetTokenUriSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NftSetTokenUriSubscription = { __typename?: 'Subscription', nftSetTokenURI: { __typename?: 'NftSetTokenUriResponse', nftId: string, tokenURI: string } };

export type ProfileUpdateSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ProfileUpdateSubscription = { __typename?: 'Subscription', profileUpdated: { __typename?: 'User', address: string } };


export const CreateAuthDocument = gql`
    mutation CreateAuth($input: CreateAuthInput!) {
  createAuth(createAuthInput: $input) {
    token
  }
}
    `;
export type CreateAuthMutationFn = Apollo.MutationFunction<CreateAuthMutation, CreateAuthMutationVariables>;

/**
 * __useCreateAuthMutation__
 *
 * To run a mutation, you first call `useCreateAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAuthMutation, { data, loading, error }] = useCreateAuthMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAuthMutation(baseOptions?: Apollo.MutationHookOptions<CreateAuthMutation, CreateAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAuthMutation, CreateAuthMutationVariables>(CreateAuthDocument, options);
      }
export type CreateAuthMutationHookResult = ReturnType<typeof useCreateAuthMutation>;
export type CreateAuthMutationResult = Apollo.MutationResult<CreateAuthMutation>;
export type CreateAuthMutationOptions = Apollo.BaseMutationOptions<CreateAuthMutation, CreateAuthMutationVariables>;
export const CreateMetadataDocument = gql`
    mutation CreateMetadata($input: CreateMetadataInput!) {
  createMetadata(input: $input)
}
    `;
export type CreateMetadataMutationFn = Apollo.MutationFunction<CreateMetadataMutation, CreateMetadataMutationVariables>;

/**
 * __useCreateMetadataMutation__
 *
 * To run a mutation, you first call `useCreateMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMetadataMutation, { data, loading, error }] = useCreateMetadataMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMetadataMutation(baseOptions?: Apollo.MutationHookOptions<CreateMetadataMutation, CreateMetadataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMetadataMutation, CreateMetadataMutationVariables>(CreateMetadataDocument, options);
      }
export type CreateMetadataMutationHookResult = ReturnType<typeof useCreateMetadataMutation>;
export type CreateMetadataMutationResult = Apollo.MutationResult<CreateMetadataMutation>;
export type CreateMetadataMutationOptions = Apollo.BaseMutationOptions<CreateMetadataMutation, CreateMetadataMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const UpdateMetadataDocument = gql`
    mutation UpdateMetadata($input: UpdateMetadataInput!) {
  updateMetadata(input: $input)
}
    `;
export type UpdateMetadataMutationFn = Apollo.MutationFunction<UpdateMetadataMutation, UpdateMetadataMutationVariables>;

/**
 * __useUpdateMetadataMutation__
 *
 * To run a mutation, you first call `useUpdateMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMetadataMutation, { data, loading, error }] = useUpdateMetadataMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMetadataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMetadataMutation, UpdateMetadataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMetadataMutation, UpdateMetadataMutationVariables>(UpdateMetadataDocument, options);
      }
export type UpdateMetadataMutationHookResult = ReturnType<typeof useUpdateMetadataMutation>;
export type UpdateMetadataMutationResult = Apollo.MutationResult<UpdateMetadataMutation>;
export type UpdateMetadataMutationOptions = Apollo.BaseMutationOptions<UpdateMetadataMutation, UpdateMetadataMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    address
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const CheckLoginDocument = gql`
    query CheckLogin {
  checkLogin
}
    `;

/**
 * __useCheckLoginQuery__
 *
 * To run a query within a React component, call `useCheckLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckLoginQuery({
 *   variables: {
 *   },
 * });
 */
export function useCheckLoginQuery(baseOptions?: Apollo.QueryHookOptions<CheckLoginQuery, CheckLoginQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckLoginQuery, CheckLoginQueryVariables>(CheckLoginDocument, options);
      }
export function useCheckLoginLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckLoginQuery, CheckLoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckLoginQuery, CheckLoginQueryVariables>(CheckLoginDocument, options);
        }
export type CheckLoginQueryHookResult = ReturnType<typeof useCheckLoginQuery>;
export type CheckLoginLazyQueryHookResult = ReturnType<typeof useCheckLoginLazyQuery>;
export type CheckLoginQueryResult = Apollo.QueryResult<CheckLoginQuery, CheckLoginQueryVariables>;
export const GetNonceDocument = gql`
    query GetNonce($address: String!) {
  getNonce(address: $address)
}
    `;

/**
 * __useGetNonceQuery__
 *
 * To run a query within a React component, call `useGetNonceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNonceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNonceQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetNonceQuery(baseOptions: Apollo.QueryHookOptions<GetNonceQuery, GetNonceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNonceQuery, GetNonceQueryVariables>(GetNonceDocument, options);
      }
export function useGetNonceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNonceQuery, GetNonceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNonceQuery, GetNonceQueryVariables>(GetNonceDocument, options);
        }
export type GetNonceQueryHookResult = ReturnType<typeof useGetNonceQuery>;
export type GetNonceLazyQueryHookResult = ReturnType<typeof useGetNonceLazyQuery>;
export type GetNonceQueryResult = Apollo.QueryResult<GetNonceQuery, GetNonceQueryVariables>;
export const GetHomepageDocument = gql`
    query GetHomepage {
  stats {
    total
    totalArtist
  }
  topSellers {
    totalSales
    address
    profileImage
    userName
  }
  newItems {
    id
    title
    fileURL
    price
    creator {
      profileImage
      address
    }
    owner {
      profileImage
      address
    }
  }
}
    `;

/**
 * __useGetHomepageQuery__
 *
 * To run a query within a React component, call `useGetHomepageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHomepageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHomepageQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetHomepageQuery(baseOptions?: Apollo.QueryHookOptions<GetHomepageQuery, GetHomepageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetHomepageQuery, GetHomepageQueryVariables>(GetHomepageDocument, options);
      }
export function useGetHomepageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHomepageQuery, GetHomepageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetHomepageQuery, GetHomepageQueryVariables>(GetHomepageDocument, options);
        }
export type GetHomepageQueryHookResult = ReturnType<typeof useGetHomepageQuery>;
export type GetHomepageLazyQueryHookResult = ReturnType<typeof useGetHomepageLazyQuery>;
export type GetHomepageQueryResult = Apollo.QueryResult<GetHomepageQuery, GetHomepageQueryVariables>;
export const GetNftsDocument = gql`
    query GetNfts($params: NftQueryParams!) {
  nft(input: $params) {
    total
    items {
      id
      title
      fileURL
      price
      mediaHeight
      mediaWidth
      creator {
        profileImage
        address
      }
      owner {
        profileImage
        address
      }
    }
  }
}
    `;

/**
 * __useGetNftsQuery__
 *
 * To run a query within a React component, call `useGetNftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftsQuery({
 *   variables: {
 *      params: // value for 'params'
 *   },
 * });
 */
export function useGetNftsQuery(baseOptions: Apollo.QueryHookOptions<GetNftsQuery, GetNftsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNftsQuery, GetNftsQueryVariables>(GetNftsDocument, options);
      }
export function useGetNftsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNftsQuery, GetNftsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNftsQuery, GetNftsQueryVariables>(GetNftsDocument, options);
        }
export type GetNftsQueryHookResult = ReturnType<typeof useGetNftsQuery>;
export type GetNftsLazyQueryHookResult = ReturnType<typeof useGetNftsLazyQuery>;
export type GetNftsQueryResult = Apollo.QueryResult<GetNftsQuery, GetNftsQueryVariables>;
export const NftDetailDocument = gql`
    query NftDetail($id: String!) {
  nftDetail(id: $id) {
    id
    tokenURI
    title
    description
    fileURL
    status
    mediaHeight
    mediaWidth
    creator {
      address
      createdAt
      email
      bio
      socialLink
      userName
      profileImage
      profileBanner
      twitterName
      instaName
    }
    owner {
      address
      userName
      profileImage
      createdAt
    }
    price
    tokenId
    tradingHistory {
      id
      event
      price
      from
      to
      createdAt
      nftId
    }
  }
}
    `;

/**
 * __useNftDetailQuery__
 *
 * To run a query within a React component, call `useNftDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useNftDetailQuery(baseOptions: Apollo.QueryHookOptions<NftDetailQuery, NftDetailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftDetailQuery, NftDetailQueryVariables>(NftDetailDocument, options);
      }
export function useNftDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftDetailQuery, NftDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftDetailQuery, NftDetailQueryVariables>(NftDetailDocument, options);
        }
export type NftDetailQueryHookResult = ReturnType<typeof useNftDetailQuery>;
export type NftDetailLazyQueryHookResult = ReturnType<typeof useNftDetailLazyQuery>;
export type NftDetailQueryResult = Apollo.QueryResult<NftDetailQuery, NftDetailQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($address: String!) {
  user(address: $address) {
    address
    createdAt
    email
    bio
    socialLink
    userName
    profileImage
    profileBanner
    twitterName
    instaName
    totalSales
  }
  checkLogin
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const NftBuyingDocument = gql`
    subscription NftBuying {
  nftBuying {
    hashTransaction
  }
}
    `;

/**
 * __useNftBuyingSubscription__
 *
 * To run a query within a React component, call `useNftBuyingSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNftBuyingSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftBuyingSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNftBuyingSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NftBuyingSubscription, NftBuyingSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NftBuyingSubscription, NftBuyingSubscriptionVariables>(NftBuyingDocument, options);
      }
export type NftBuyingSubscriptionHookResult = ReturnType<typeof useNftBuyingSubscription>;
export type NftBuyingSubscriptionResult = Apollo.SubscriptionResult<NftBuyingSubscription>;
export const NftDelistingDocument = gql`
    subscription NftDelisting {
  nftDelisting {
    hashTransaction
  }
}
    `;

/**
 * __useNftDelistingSubscription__
 *
 * To run a query within a React component, call `useNftDelistingSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNftDelistingSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftDelistingSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNftDelistingSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NftDelistingSubscription, NftDelistingSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NftDelistingSubscription, NftDelistingSubscriptionVariables>(NftDelistingDocument, options);
      }
export type NftDelistingSubscriptionHookResult = ReturnType<typeof useNftDelistingSubscription>;
export type NftDelistingSubscriptionResult = Apollo.SubscriptionResult<NftDelistingSubscription>;
export const NftListingDocument = gql`
    subscription NftListing {
  nftListing {
    hashTransaction
  }
}
    `;

/**
 * __useNftListingSubscription__
 *
 * To run a query within a React component, call `useNftListingSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNftListingSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftListingSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNftListingSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NftListingSubscription, NftListingSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NftListingSubscription, NftListingSubscriptionVariables>(NftListingDocument, options);
      }
export type NftListingSubscriptionHookResult = ReturnType<typeof useNftListingSubscription>;
export type NftListingSubscriptionResult = Apollo.SubscriptionResult<NftListingSubscription>;
export const NftMintedDocument = gql`
    subscription NftMinted {
  nftMinted {
    nftMinted
    nftId
  }
}
    `;

/**
 * __useNftMintedSubscription__
 *
 * To run a query within a React component, call `useNftMintedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNftMintedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftMintedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNftMintedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NftMintedSubscription, NftMintedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NftMintedSubscription, NftMintedSubscriptionVariables>(NftMintedDocument, options);
      }
export type NftMintedSubscriptionHookResult = ReturnType<typeof useNftMintedSubscription>;
export type NftMintedSubscriptionResult = Apollo.SubscriptionResult<NftMintedSubscription>;
export const NftSetTokenUriDocument = gql`
    subscription NftSetTokenURI {
  nftSetTokenURI {
    nftId
    tokenURI
  }
}
    `;

/**
 * __useNftSetTokenUriSubscription__
 *
 * To run a query within a React component, call `useNftSetTokenUriSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNftSetTokenUriSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftSetTokenUriSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNftSetTokenUriSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NftSetTokenUriSubscription, NftSetTokenUriSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NftSetTokenUriSubscription, NftSetTokenUriSubscriptionVariables>(NftSetTokenUriDocument, options);
      }
export type NftSetTokenUriSubscriptionHookResult = ReturnType<typeof useNftSetTokenUriSubscription>;
export type NftSetTokenUriSubscriptionResult = Apollo.SubscriptionResult<NftSetTokenUriSubscription>;
export const ProfileUpdateDocument = gql`
    subscription ProfileUpdate {
  profileUpdated {
    address
  }
}
    `;

/**
 * __useProfileUpdateSubscription__
 *
 * To run a query within a React component, call `useProfileUpdateSubscription` and pass it any options that fit your needs.
 * When your component renders, `useProfileUpdateSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileUpdateSubscription({
 *   variables: {
 *   },
 * });
 */
export function useProfileUpdateSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ProfileUpdateSubscription, ProfileUpdateSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ProfileUpdateSubscription, ProfileUpdateSubscriptionVariables>(ProfileUpdateDocument, options);
      }
export type ProfileUpdateSubscriptionHookResult = ReturnType<typeof useProfileUpdateSubscription>;
export type ProfileUpdateSubscriptionResult = Apollo.SubscriptionResult<ProfileUpdateSubscription>;