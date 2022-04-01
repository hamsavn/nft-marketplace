import React, { memo } from 'react';
import UserTopSeller from './UserTopSeller';
import { User } from '@generated/graphql';

interface Props {
  users: User[];
}

export const AuthorList: React.FC<Props> = ({ users }) => {
  return (
    <div className="row author_list">
      {users.map((author, index) => (
        <div className="col-lg-3 col-md-6 mb-5" key={index}>
          <UserTopSeller user={author} />
        </div>
      ))}
    </div>
  );
};
