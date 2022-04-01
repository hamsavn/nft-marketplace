import React, { useEffect, useState } from 'react';
import withPrivateRoute from '../lib/withPrivateRoute';
import { useRouter } from 'next/router';
import { useAppSelector } from '@store/index';
import { toast } from 'react-toastify';
import { CreateMetadataInput, NftMintedResponse } from '@generated/graphql';
import { RepositoryFactory } from '@repositories/RepositoryFactory';
import NftServices from '@core/nft/nft-service';
import NftForm, { NftFormFields } from '@components/nft-form';
import { Modal } from '@components/Modal';

function Mint() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [hashFromClient, setHashFromClient] = useState<string>();

  useEffect(() => {
    let unsubscribe: () => void | null = null;

    RepositoryFactory.get('nft')
      .nftMintedsubscription(handleMintedSubscription)
      .then((subscribe) => (unsubscribe = subscribe.unsubscribe))
      .catch((error) => toast(error.message));

    if (unsubscribe) return unsubscribe();
  }, [hashFromClient]);

  const handleMintedSubscription = ({ nftId, nftMinted }: NftMintedResponse) => {
    if (nftMinted === hashFromClient) {
      setLoading(false);
      toast.success('Create artwork success');

      setTimeout(() => {
        router.push(`/nft/${nftId}`);
      }, 1000);
    }
  };

  const handSubmit = async (values: NftFormFields) => {
    try {
      setLoading(true);

      const input = {
        description: values.description,
        title: values.title,
        media: values.file,
      } as CreateMetadataInput;

      const tokenUrI = await RepositoryFactory.get('nft').createMetadata(input);

      const { hash } = await NftServices.minting(tokenUrI);

      setHashFromClient(hash);
    } catch (error) {
      console.log(error);
      const m = error.message;

      toast.error(m);

      setLoading(false);
    }
  };

  const user = useAppSelector((state) => state.app.user);

  return (
    <div className="greyscheme">
      <section className="jumbotron breadcumb no-bg">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Create Artwork</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NftForm actionName="Create artwork" onSubmit={handSubmit} submitLoading={loading} />
      <Modal active={loading}>Creating your artwork...</Modal>
    </div>
  );
}

export default withPrivateRoute(Mint);
