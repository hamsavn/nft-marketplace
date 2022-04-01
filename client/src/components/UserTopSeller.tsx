import React, { memo } from 'react';
import { User } from '@generated/graphql';
import { getFileUrl } from '@lib/get-file-url';
import Link from 'next/link';
import { truncateAddress } from '@lib/format-address';

interface Props {
  user: User;
}

const UserTopSeller: React.FC<Props> = ({ user }) => {
  return (
    <>
      <div className="author_list_pp">
        <Link href={`/author/${user.address}`}>
          <span>
            <img className="lazy" src={getFileUrl(user.profileImage)} alt="" />
            <i className="fa fa-check"></i>
          </span>
        </Link>
      </div>

      <div className="author_list_info">
        <Link href={`/author/${user.address}`}>
          {user.userName ? (
            <span>{user.userName}</span>
          ) : (
            <span>{truncateAddress(user.address, 11)}</span>
          )}
        </Link>
        <span className="bot" title="Total sales">
          {user.totalSales} ETH
        </span>
      </div>
    </>
  );
};

export default memo(UserTopSeller);
