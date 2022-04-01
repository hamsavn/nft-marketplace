import React, { useEffect, useState } from 'react';
import withPrivateRoute from '../../lib/withPrivateRoute';
import { useRouter } from 'next/router';
import { useAppSelector } from '@store/index';
import { toast } from 'react-toastify';
import { Nft, UpdateMetadataInput } from '@generated/graphql';
import { RepositoryFactory } from '@repositories/RepositoryFactory';
import { Button } from '@components/Button';
import { GetServerSidePropsContext } from 'next';
import NftForm, { NftFormFields } from '@components/nft-form';
import NftServices from '@core/nft/nft-service';
import { Modal } from '@components/Modal';

interface Props {
  nft: Nft;
}

const EditNft: React.FC<Props> = ({ nft }) => {
  const router = useRouter();
  const [submitLoading, setSubmitLoading] = useState(false);

  // @ts-ignore
  useEffect(async () => {
    const { unsubscribe } = await RepositoryFactory.get('nft').nftSetTokenURISubscription(
      ({ nftId, tokenURI }) => {
        if (nftId === nft.id) {
          toast.success('Update successfully');

          setSubmitLoading(false);
        }
      },
    );

    return unsubscribe;
  }, [nft]);

  const handleSubmit = async (values: NftFormFields) => {
    try {
      setSubmitLoading(true);

      const input = {
        ipfsHash: nft.tokenURI,
        description: values.description,
        title: values.title,
      } as UpdateMetadataInput;
      if (values.file) input.media = values.file;

      const IpfsHash = await RepositoryFactory.get('nft').updateMetadata(input); // new tokenURI

      await NftServices.setTokenURI(nft.tokenId, IpfsHash);
    } catch (error) {
      console.log(error);
      const m = error.message;

      toast.error(m);

      setSubmitLoading(false);
    }
  };

  const user = useAppSelector((state) => state.app.user);
  const wallet = useAppSelector((state) => state.app.wallet);

  const subView = (message: string) => {
    return (
      <div className="greyscheme">
        <section className="jumbotron breadcumb no-bg">
          <div className="mainbreadcumb">
            <div className="container">
              <div className="row m-10-hor">
                <div className="col-12">
                  <h1 className="text-center">Update Artwork</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="row">
            <h3>{message}</h3>
          </div>
          <Button onClick={() => router.push(`/nft/${nft.id}`)}>Nft</Button>
        </section>
      </div>
    );
  };

  if (wallet.address !== nft.owner.address) {
    return subView('Please buy this artwork first');
  }

  if (nft.status !== 'minted') {
    return subView('Nft not valid to edit');
  }

  return (
    <div className="greyscheme">
      <section className="jumbotron breadcumb no-bg">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Update Artwork</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NftForm
        nft={nft}
        actionName="Update artwork"
        onSubmit={handleSubmit}
        submitLoading={submitLoading}
      />
      <Modal active={submitLoading}>Updating your artwork...</Modal>
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // Fetch data from external API
  const nft = await RepositoryFactory.get('nft').nftDetail(String(ctx.params.nftId));

  // Pass data to the page via props
  return { props: { nft } };
}

export default withPrivateRoute(EditNft);
