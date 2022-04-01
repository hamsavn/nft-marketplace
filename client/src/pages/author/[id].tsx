import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ColumnNewRedux from '@components/ColumnNewRedux';
import { GetServerSidePropsContext } from 'next';
import { RepositoryFactory } from '@repositories/RepositoryFactory';
import { User, NftResponse } from '@generated/graphql';
import { getFileUrl } from '@lib/get-file-url';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Button } from '@components/Button';
import { useAppSelector } from '@store/index';

interface Props {
  author: User;
  data: NftResponse;
}

enum TabName {
  collected = 'Collected',
  created = 'Created',
}

const Colection: React.FC<Props> = ({ author, data }) => {
  const router = useRouter();
  const { wallet } = useAppSelector((state) => state.app);
  const tabs = Object.values(TabName);

  const onClickTab = (tab: TabName) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        tab,
      },
    });
  };

  const activeTab = router.query.tab || TabName.collected;

  const copyAddress = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success('Address Copied');
  };

  const nickName = author.instaName || author.twitterName;

  return (
    <div className="greyscheme">
      <section className="container no-bottom">
        <div className="row">
          <div className="spacer-double"></div>
          <div className="col-md-12 de-flex author-title">
            <div className="d_profile de-flex">
              <div className="de-flex-col">
                <div className="profile_avatar">
                  <img src={getFileUrl(author.profileImage)} alt="" />
                  <i className="fa fa-check"></i>
                  <div className="profile_name">
                    <h4>
                      {author.userName}
                      <span className="profile_username">@{nickName}</span>
                      <span id="wallet" className="profile_wallet mt-1">
                        {author.address}
                      </span>
                      <button
                        id="btn_copy"
                        title="Copy Text"
                        onClick={() => copyAddress(author.address)}
                      >
                        Copy
                      </button>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            {wallet.address && wallet.address === author.address && (
              <div className="d_edit_button">
                <Button onClick={() => router.push(`/profile`)}>Edit</Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container no-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="items_filter">
              <ul className="de_nav text-left">
                {tabs.map((tab) => {
                  return (
                    <li className={tab === activeTab ? 'active' : undefined} key={tab}>
                      <span onClick={() => onClickTab(tab)}>{tab}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        {tabs.map((tab) => {
          if (tab === activeTab) {
            return (
              <div className="onStep fadeIn" key={tab}>
                <ColumnNewRedux items={data.items} />
              </div>
            );
          }

          return null;
        })}
      </section>
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const activeTab = ctx.query.tab || TabName.collected;
  const authorAddress = ctx.params.id as string;

  const data = await RepositoryFactory.get('nft').getNfts({
    pagination: {
      page: 1,
      perPage: 100,
    },
    owner: activeTab === TabName.collected ? authorAddress : undefined,
    creator: activeTab === TabName.created ? authorAddress : undefined,
  });

  const author = await RepositoryFactory.get('auth').getuser(ctx.params.id as string);

  return { props: { data, author: author.user } };
}

export default memo(Colection);
