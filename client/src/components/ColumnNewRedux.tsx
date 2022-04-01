import React, { useState } from 'react';
import NftCard from './NftCard';
import { Nft } from '@generated/graphql';

interface Props {
  items: Nft[];
}

const ColumnNewRedux: React.FC<Props> = ({ items }) => {
  return (
    <div className="row">
      {items.map((nft) => {
        return <NftCard item={nft} height={300} key={nft.id} />;
      })}
      {!items.length && (
        <div style={{ textAlign: 'center', marginTop: 50, fontSize: 18 }}>No items found.</div>
      )}
    </div>
  );
};

export default ColumnNewRedux;
