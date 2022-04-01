import React, { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/router';

interface Props {
  total: number;
}

const TopFilterBar: React.FC<Props> = ({ total }) => {
  const router = useRouter();

  const onSearch = useDebouncedCallback((value: string) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: value,
      },
    });
  }, 300);

  return (
    <div className="items_filter text-center author-page">
      <span style={{ position: 'absolute', left: 0, bottom: 16, fontWeight: 600 }}>
        {total} Items
      </span>
      <div className="row form-dark" id="form_quick_search">
        <div className="col">
          <input
            className="form-control"
            id="name_1"
            name="name_1"
            placeholder="search item here..."
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            defaultValue={router.query.search}
          />
          <button id="btn-submit">
            <i className="fa fa-search bg-color-secondary"></i>
          </button>
          <div className="clearfix"></div>
        </div>
      </div>
    </div>
  );
};

export default TopFilterBar;
