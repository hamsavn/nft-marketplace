import React from 'react';
import Particle from '@components/Particle';
import SliderMainParticleGrey from '@components/SliderMainParticleGrey';
import { Featurebox } from '@components/FeatureBox';
import { RepositoryFactory } from '@repositories/RepositoryFactory';
import { GetHomepageQueryResult, User, Nft } from '@generated/graphql';
import { AuthorList } from '@components/AuthorListRedux';
import { CarouselNewRedux } from '@components/CarouselNewRedux';
import { useWallet } from '@hooks/wallet';
interface Props {
  data: GetHomepageQueryResult['data'];
}

const Index: React.FC<Props> = ({ data }) => {
  const { connectWallet } = useWallet();

  return (
    <div className="greyscheme">
      <section
        className="jumbotron no-bg relative"
        style={{ backgroundImage: `url(${'./img/background/8.jpg'})` }}
      >
        <Particle />
        <SliderMainParticleGrey stats={data.stats} />
      </section>

      <section className="container no-bottom">
        <div className="row">
          <div className="col-lg-2 col-sm-4 col-6 mb30" onClick={connectWallet}>
            <span className="box-url">
              <img src="./img/wallet/1.png" alt="" className="mb20" />
              <h4>Metamask</h4>
            </span>
          </div>
          <div className="col-lg-2 col-sm-4 col-6 mb30">
            <span className="box-url box-url-disable">
              <img src="./img/wallet/2.png" alt="" className="mb20" />
              <h4>Bitski</h4>
            </span>
          </div>

          <div className="col-lg-2 col-sm-4 col-6 mb30">
            <span className="box-url box-url-disable">
              <img src="./img/wallet/3.png" alt="" className="mb20" />
              <h4>Fortmatic</h4>
            </span>
          </div>

          <div className="col-lg-2 col-sm-4 col-6 mb30">
            <span className="box-url box-url-disable">
              <img src="./img/wallet/4.png" alt="" className="mb20" />
              <h4>WalletConnect</h4>
            </span>
          </div>

          <div className="col-lg-2 col-sm-4 col-6 mb30">
            <span className="box-url box-url-disable">
              <img src="./img/wallet/5.png" alt="" className="mb20" />
              <h4>Coinbase Wallet</h4>
            </span>
          </div>

          <div className="col-lg-2 col-sm-4 col-6 mb30">
            <span className="box-url box-url-disable">
              <img src="./img/wallet/6.png" alt="" className="mb20" />
              <h4>Arkane</h4>
            </span>
          </div>
        </div>
      </section>

      <section className="container no-top no-bottom">
        <div className="row">
          <div className="spacer-double"></div>
          <div className="col-lg-12 mb-2">
            <h2>New Items</h2>
          </div>
        </div>
        <CarouselNewRedux items={data.newItems as Nft[]} />
      </section>

      <section className="container no-top no-bottom">
        <div className="row">
          <div className="spacer-double"></div>
          <div className="col-lg-12 mb-5">
            <h2>Top Sellers</h2>
          </div>
          <div className="col-lg-12">
            <AuthorList users={data.topSellers as User[]} />
          </div>
        </div>
      </section>

      {/* <section className="container no-top no-bottom">
        <div className="row">
          <div className="spacer-double"></div>
          <div className="col-lg-12 mb-2">
            <h2>Hot Collections</h2>
          </div>
          <div className="col-lg-12">
            <CarouselCollectionRedux />
          </div>
        </div>
      </section> */}

      <section className="container no-top">
        <div className="row">
          <div className="spacer-double"></div>
          <div className="col-lg-12 mb-3">
            <h2>Create and Sell Now</h2>
          </div>
          <Featurebox />
        </div>
      </section>
    </div>
  );
};

export async function getServerSideProps() {
  const data = await RepositoryFactory.get('app').getHomepage();

  return { props: { data } };
}

export default Index;
