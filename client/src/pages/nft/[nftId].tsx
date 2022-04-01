import { Button } from '@components/Button';
import NftServices from '@core/nft/nft-service';
import { Nft, NftDelistingResponse } from '@generated/graphql';
import { RepositoryFactory } from '@repositories/RepositoryFactory';
import { useAppSelector } from '@store/index';
import { useFormik } from 'formik';
import { DateTime } from 'luxon';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getFileUrl } from '@lib/get-file-url';
import { useAuth } from '@hooks/auth';
import { Address } from '@components/Address';
import { Modal } from '@components/Modal';

const DEFAULT_ARTWORK = './../img/items/big-1.jpg';
const DEFAULT_AVATAR = 'https://storage.googleapis.com/opensea-static/opensea-profile/18.png';
interface Props {
  nft: Nft;
}

const Nft: React.FC<Props> = ({ nft }) => {
  const router = useRouter();
  const { nftId } = router.query;
  const nftIdFormated = typeof nftId === 'string' && nftId ? nftId : undefined;
  const { user, wallet } = useAppSelector((state) => state.app);
  const { signIn } = useAuth();
  const [delistLoading, setDelistLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  const [sellingForm, setSellingForm] = useState<{
    open: boolean;
    loading: boolean;
  }>({
    open: false,
    loading: false,
  });
  const sellingFormik = useFormik({
    initialValues: { price: 0 }, // Ether
    validate: (values) => {
      const errs: { [key: string]: string } = {};

      if (values.price < 0) {
        errs.price = 'Must be greater than 0';
      }

      return errs;
    },
    onSubmit: async (values) => {
      try {
        setSellingForm({ loading: true, open: false });

        if (!wallet.isconnected) {
          return router.push('/wallet');
        }

        const isLogin = await RepositoryFactory.get('auth').checkLogin();

        if (!isLogin) {
          await signIn();
        }

        const { hash } = await NftServices.addOrder(nft.tokenId, values.price);
        setHashFromClient(hash);
      } catch (error) {
        console.log(error);

        const m = error.message;
        toast.error(m);

        setSellingForm({ loading: false, open: false });
      }
    },
  });

  const [hashFromClient, setHashFromClient] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void | null = null;

    RepositoryFactory.get('nft')
      .nftDelistingsubscription(handleDelistingSubscription)
      .then((subscribe) => (unsubscribe = subscribe.unsubscribe))
      .catch((error) => toast(error.message));

    if (unsubscribe) return unsubscribe();
  }, [hashFromClient]);

  const handleDelistingSubscription = ({ hashTransaction }: NftDelistingResponse) => {
    if (hashTransaction === hashFromClient) {
      setDelistLoading(false);
      toast.success('Delisting artwork success');
      router.replace(router.asPath);
    }
  };

  useEffect(() => {
    let unsubscribe: () => void | null = null;
    RepositoryFactory.get('nft')
      .nftListingsubscription(handleListingSubscription)
      .then((subscribe) => (unsubscribe = subscribe.unsubscribe))
      .catch((error) => toast(error.message));

    if (unsubscribe) return unsubscribe();
  }, [hashFromClient]);

  const handleListingSubscription = ({ hashTransaction }: NftDelistingResponse) => {
    if (hashTransaction === hashFromClient) {
      setSellingForm({ loading: false, open: false });
      toast.success('Listing artwork success');
      router.replace(router.asPath);
    }
  };

  useEffect(() => {
    let unsubscribe: () => void | null = null;
    RepositoryFactory.get('nft')
      .nftBuyingsubscription(handleBuyingSubscription)
      .then((subscribe) => (unsubscribe = subscribe.unsubscribe))
      .catch((error) => toast(error.message));

    if (unsubscribe) return unsubscribe();
  }, [hashFromClient]);

  const handleBuyingSubscription = ({ hashTransaction }: NftDelistingResponse) => {
    if (hashTransaction === hashFromClient) {
      setBuyLoading(false);
      toast.success('Buying artwork success');
      router.replace(router.asPath);
    }
  };

  const buyThisNft = async (e) => {
    setBuyLoading(true);

    try {
      if (!wallet.isconnected) {
        return router.push('/wallet');
      }

      const isLogin = await RepositoryFactory.get('auth').checkLogin();

      if (!isLogin) {
        await signIn();
      }

      const { hash } = await NftServices.executeOrder(nft.tokenId, nft.price);
      setHashFromClient(hash);
    } catch (error) {
      const m = error.message;
      toast.error(m);
      setBuyLoading(false);
    }
  };

  const delisting = async () => {
    setDelistLoading(true);

    try {
      const { hash } = await NftServices.cancelOrder(nft.tokenId);
      setHashFromClient(hash);
    } catch (e) {
      console.error(e);
      setDelistLoading(false);
    }
  };

  return (
    <div className="greyscheme">
      <section className="container">
        <div className="row mt-md-5 pt-md-4">
          <div className="col-md-6 text-center">
            <img
              src={getFileUrl(nft.fileURL)}
              className="img-fluid img-rounded mb-sm-30"
              style={{ width: '100%' }}
              alt="artwork"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = DEFAULT_ARTWORK;
              }}
            />
          </div>

          <div className="col-md-6">
            <div className="item_info">
              <h2>{nft.title}</h2>
              <p>{nft.description}</p>

              <div className="spacer-20"></div>

              <div className="d-flex flex-row" style={{ gap: '40px' }}>
                <div>
                  <h6>Owner</h6>
                  <div
                    className="item_author"
                    onClick={() => {
                      router.push(`/author/${nft.owner.address}`);
                    }}
                  >
                    <div className="author_list_pp">
                      <span>
                        <img
                          className="lazy"
                          src={getFileUrl(nft.owner.profileImage || DEFAULT_AVATAR)}
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </span>
                    </div>
                    <div className="author_list_info">
                      <span>
                        {wallet.address === nft.owner.address ? (
                          'You'
                        ) : (
                          <Address address={nft.owner.address} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h6>Creator</h6>
                  <div
                    className="item_author"
                    onClick={() => {
                      router.push(`/author/${nft.creator.address}`);
                    }}
                  >
                    <div className="author_list_pp">
                      <span>
                        <img
                          className="lazy"
                          src={getFileUrl(nft.creator.profileImage || DEFAULT_AVATAR)}
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </span>
                    </div>
                    <div className="author_list_info">
                      <span>
                        {wallet.address === nft.creator.address ? (
                          'You'
                        ) : (
                          <Address address={nft.creator.address} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="spacer-20"></div>

              {nft.status === 'listing' && (
                <>
                  <div className="spacer-40"></div>
                  <h6>Price</h6>
                  <h4>{nft.price} ETH</h4>
                </>
              )}

              <div className="spacer-30"></div>

              <div className="de_tab">
                {wallet.address && wallet.address === nft.owner.address && (
                  <>
                    <div className="d-flex flex-row">
                      {nft.status === 'minted' && (
                        <>
                          <button
                            className="btn-main btn2 lead mb-5 mr10"
                            onClick={() => setSellingForm({ ...sellingForm, open: true })}
                          >
                            List for sale
                          </button>
                          <button
                            className="btn-main lead mb-5"
                            onClick={() => {
                              router.push(`/edit-nft/${nft.id}`);
                            }}
                            style={{ backgroundColor: '#484848' }}
                          >
                            Edit
                          </button>
                        </>
                      )}

                      {nft.status === 'listing' && (
                        <Button
                          loading={loading}
                          className="btn-main btn2 lead mb-5"
                          onClick={delisting}
                        >
                          Delisting
                        </Button>
                      )}
                    </div>
                  </>
                )}

                {wallet.address !== nft.owner.address && (
                  <>
                    <div className="d-flex flex-row">
                      {nft.status === 'minted' && (
                        <button className="btn-main lead mb-5 mr15" onClick={() => {}}>
                          Offer
                        </button>
                      )}
                      {nft.status === 'listing' && (
                        <button className="btn-main lead mb-5 mr15" onClick={buyThisNft}>
                          Buy now
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              <h6>Trading History</h6>
              <table className="trading-table">
                <thead>
                  <tr>
                    <th scope="col">Event</th>
                    <th scope="col">Price (eth)</th>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Date</th>
                  </tr>
                  <tr></tr>
                </thead>
                <tbody>
                  {!nft.tradingHistory.length && (
                    <>
                      <tr>Empty</tr>
                    </>
                  )}

                  {nft.tradingHistory
                    .slice(0)
                    .reverse()
                    .map((record) => (
                      <tr key={record.id}>
                        <td>{record.event}</td>
                        <td>{record.price}</td>
                        <td className="text-danger">
                          <Address address={record.from} />
                        </td>
                        <td className="text-danger">
                          <Address address={record.to} />
                        </td>
                        <td>{DateTime.fromMillis(Number(record.createdAt)).toRelative()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {sellingForm.open && (
        <div className="checkout">
          <div className="maincheckout">
            <button
              className="btn-close"
              onClick={() => {
                if (!sellingForm.loading) {
                  setSellingForm({ ...sellingForm, open: false });
                }
              }}
            >
              x
            </button>
            <div className="heading">
              <h3>List for sale</h3>
            </div>

            <div className="detailcheckout mt-4">
              <div className="listcheckout">
                <h6>Price (ETH)</h6>
                <input
                  id="price"
                  type="number"
                  name="price"
                  min={0}
                  step={1}
                  placeholder="Interger value"
                  className="form-control"
                  value={sellingFormik.values.price}
                  onChange={sellingFormik.handleChange}
                  onBlur={sellingFormik.handleBlur}
                />
              </div>
            </div>

            {sellingFormik.touched.price && sellingFormik.errors.price && (
              <small className="text-danger">{sellingFormik.errors.price}</small>
            )}

            <Button onClick={sellingFormik.handleSubmit} loading={sellingForm.loading}>
              Complete listing
            </Button>
          </div>
        </div>
      )}
      <Modal active={sellingForm.loading || buyLoading || delistLoading}>
        {sellingForm.loading && <span>Listing your artwork...</span>}
        {buyLoading && <span>Buying the artwork...</span>}
        {delistLoading && <span>Delisting the artwork...</span>}
      </Modal>
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // Fetch data from external API
  const nft = await RepositoryFactory.get('nft').nftDetail(String(ctx.params.nftId));

  // Pass data to the page via props
  return { props: { nft } };
}

export default Nft;
