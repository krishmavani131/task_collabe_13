import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function getPageUrl(isAdmin, keyword, pageNumber) {
  if (isAdmin) {
    return `/admin/productlist/${pageNumber}`;
  }
  if (keyword) {
    return `/search/${keyword}/page/${pageNumber}`;
  }
  return `/page/${pageNumber}`;
}

function Paginate({ pages, page, isAdmin = false, keyword = '' }) {
  if (pages <= 1) {
    return null;
  }

  const pageNumbers = [...Array(pages).keys()];

  return (
    <Pagination>
      {pageNumbers.map((x) => {
        const pageNumber = x + 1;
        const url = getPageUrl(isAdmin, keyword, pageNumber);
        const isActive = pageNumber === page;

        return (
          <Pagination.Item
            as={Link}
            key={pageNumber}
            to={url}
            active={isActive}
          >
            {pageNumber}
          </Pagination.Item>
        );
      })}
    </Pagination>
  );
}

export default Paginate;