import React, { memo } from 'react';
import styled from 'styled-components';
import { Nft } from '@generated/graphql';
import Link from 'next/link';
import { getFileUrl } from '@lib/get-file-url';
import Image from 'next/image';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
`;

interface Props {
  item: Nft;
  className?: string;
  clockTop?: boolean;
  height: number;
}
const NftCard: React.FC<Props> = ({
  item,
  className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4',
  height,
}) => {
  return (
    <div className={className}>
      <div className="nft__item m-0">
        <div className="author_list_pp">
          <Link href={`/author/${item.owner.address}`} passHref>
            <a>
              <img className="lazy" src={getFileUrl(item.owner.profileImage)} alt="creator" />
              <i className="fa fa-check"></i>
            </a>
          </Link>
        </div>

        <div>
          <Link href={`/nft/${item.id}`}>
            <div>
              <div className="nft__item_wrap" style={{ height: `${height}px`, width: '100%' }}>
                <Outer style={{ width: '100%' }}>
                  <span>
                    <Image
                      src={getFileUrl(item.fileURL)}
                      className="lazy nft__item_preview"
                      alt=""
                      width={300}
                      height={(item.mediaHeight / item.mediaWidth) * 300 || 300}
                      layout="responsive"
                    />
                  </span>
                </Outer>
              </div>
              <div className="nft__item_info">
                <span>
                  <h4>{item.title}</h4>
                </span>
                <div
                  className="nft__item_price"
                  style={{ visibility: item.price ? 'visible' : 'hidden' }}
                >
                  {item.price} ETH
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(NftCard);
