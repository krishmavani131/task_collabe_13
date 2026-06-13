import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  // API call
  const { data, isLoading, error } = useGetProductsQuery(
    {
      keyword,
      pageNumber,
    },
    {
      refetchOnMountOrArgChange: true, // always fresh data
    }
  );

  // Safe fallback (important for crash prevention)
  const products = data?.products || [];
  const page = data?.page || 1;
  const pages = data?.pages || 1;

  return (
    <>
      {/* Carousel or Back button */}
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}

      {/* Loading */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || 'Something went wrong'}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Latest Products</h1>

          <Row>
            {products.length === 0 ? (
              <Message>No Products Found</Message>
            ) : (
              products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))
            )}
          </Row>

          <Paginate
            pages={pages}
            page={page}
            keyword={keyword || ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;