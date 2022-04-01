import {
  CreateMetadataInput,
  CreateMetadataMutation,
  CreateMetadataMutationVariables,
  NftMintedSubscription,
  NftMintedSubscriptionVariables,
  NftMintedResponse,
  NftDetailQuery,
  NftDetailQueryVariables,
  Nft,
  UpdateMetadataInput,
  UpdateMetadataMutation,
  UpdateMetadataMutationVariables,
  NftQueryParams,
  NftResponse,
  GetNftsQueryVariables,
  GetNftsQuery,
  NftDelistingResponse,
  NftDelistingSubscription,
  NftDelistingSubscriptionVariables,
  NftListingSubscription,
  NftListingSubscriptionVariables,
  NftBuyingSubscription,
  NftBuyingSubscriptionVariables,
  NftSetTokenUriSubscription,
  NftSetTokenUriSubscriptionVariables,
  NftSetTokenUriResponse,
} from '@generated/graphql';

import Repository from './Repository';
import createMedata from '@graphql/mutations/createMetadata.graphql';
import nftMintedSubscription from '@graphql/subscriptions/nftMinted.graphql';
import nftDelistingSubscription from '@graphql/subscriptions/nftDelisting.graphql';
import nftDetailQuery from '@graphql/queries/nftDetail.graphql';
import updateMetadata from '@graphql/mutations/updateMetadata.graphql';
import nftQuery from '@graphql/queries/nft.graphql';
import nftListingSubscription from '@graphql/subscriptions/nftListing.graphql';
import nftBuyingSubscription from '@graphql/subscriptions/nftBuying.graphql';
import nftSetTokenURISubscription from '@graphql/subscriptions/nftSetTokenURI.graphql';

export default {
  async createMetadata(input: CreateMetadataInput): Promise<string> {
    const { data } = await Repository.mutation<
      CreateMetadataMutation,
      CreateMetadataMutationVariables
    >({
      mutation: createMedata,
      variables: {
        input,
      },
    });
    return data.createMetadata;
  },

  async nftMintedsubscription(handler: (value: NftMintedResponse) => void) {
    const data = await Repository.subscribe<NftMintedSubscription, NftMintedSubscriptionVariables>({
      query: nftMintedSubscription,
    });

    return data.subscribe((value) => {
      handler(value.data.nftMinted);
    });
  },

  async nftDelistingsubscription(handler: (value: NftDelistingResponse) => void) {
    const data = await Repository.subscribe<
      NftDelistingSubscription,
      NftDelistingSubscriptionVariables
    >({
      query: nftDelistingSubscription,
    });

    return data.subscribe((value) => {
      handler(value.data.nftDelisting);
    });
  },

  async nftDetail(id: string): Promise<Nft> {
    const { data } = await Repository.query<NftDetailQuery, NftDetailQueryVariables>({
      query: nftDetailQuery,
      variables: {
        id,
      },
    });

    return data.nftDetail as Nft;
  },

  async updateMetadata(input: UpdateMetadataInput): Promise<string> {
    const { data } = await Repository.mutation<
      UpdateMetadataMutation,
      UpdateMetadataMutationVariables
    >({
      mutation: updateMetadata,
      variables: {
        input: input,
      },
    });

    return data.updateMetadata;
  },

  async getNfts(params: NftQueryParams): Promise<NftResponse> {
    const { data } = await Repository.query<GetNftsQuery, GetNftsQueryVariables>({
      query: nftQuery,
      variables: {
        params,
      },
    });

    return data.nft as NftResponse;
  },

  async nftListingsubscription(handler: (value: NftDelistingResponse) => void) {
    const data = await Repository.subscribe<
      NftListingSubscription,
      NftListingSubscriptionVariables
    >({
      query: nftListingSubscription,
    });

    return data.subscribe((value) => {
      handler(value.data.nftListing);
    });
  },

  async nftBuyingsubscription(handler: (value: NftDelistingResponse) => void) {
    const data = await Repository.subscribe<NftBuyingSubscription, NftBuyingSubscriptionVariables>({
      query: nftBuyingSubscription,
    });

    return data.subscribe((value) => {
      handler(value.data.nftBuying);
    });
  },

  async nftSetTokenURISubscription(handler: (value: NftSetTokenUriResponse) => void) {
    const data = await Repository.subscribe<
      NftSetTokenUriSubscription,
      NftSetTokenUriSubscriptionVariables
    >({
      query: nftSetTokenURISubscription,
    });

    return data.subscribe((value) => {
      // TODO: ERROR HERE
      handler(value.data.nftSetTokenURI);
    });
  },
};
