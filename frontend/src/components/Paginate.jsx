import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = '',
}) => {
  const getPageLink = (pageNumber) => {
    if (isAdmin) {
      return `/admin/productlist/${pageNumber}`;
    }

    return keyword
      ? `/search/${keyword}/page/${pageNumber}`
      : `/page/${pageNumber}`;
  };

  if (pages <= 1) return null;

  return (
    <Pagination>
      {Array.from({ length: pages }, (_, index) => (
        <Pagination.Item
          key={index + 1}
          as={Link}
          to={getPageLink(index + 1)}
          active={page === index + 1}
        >
          {index + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default Paginate;