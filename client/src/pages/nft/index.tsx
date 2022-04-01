import React, { useState, useEffect } from 'react';
import ColumnNewRedux from '@components/ColumnNewRedux';
import TopFilterBar from '@components/TopFilterBar';
import { NftResponse, Nft } from '@generated/graphql';
import { RepositoryFactory } from '@repositories/RepositoryFactory';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Button } from '@components/Button';

const PER_PAGE = 16;

interface Props {
  data: NftResponse;
}

const Explore: React.FC<Props> = ({ data }) => {
  const [items, setItems] = useState(data.items);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const data = await RepositoryFactory.get('nft').getNfts({
        pagination: {
          page: nextPage,
          perPage: PER_PAGE,
        },
        search: router.query.search as string,
      });

      setItems([...items, ...data.items]);
      setPage(nextPage);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Reset data on data change
  useEffect(() => {
    setItems(data.items);
    setPage(1);
  }, [data]);

  const showLoadMore = data.total > page * PER_PAGE;

  return (
    <div className="greyscheme">
      <section className="jumbotron breadcumb no-bg">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Explore</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-12">
            <TopFilterBar total={data.total} />
          </div>
        </div>
        <ColumnNewRedux items={items} />
        {showLoadMore && (
          <div className="col-lg-12">
            <div className="spacer-single"></div>
            <Button onClick={loadMore} className="lead m-auto" loading={loading}>
              Load More
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const query = ctx.query || {};

  const data = await RepositoryFactory.get('nft').getNfts({
    pagination: {
      page: 1,
      perPage: PER_PAGE,
    },
    search: query.search as string,
  });

  return { props: { data } };
}

export default Explore;
