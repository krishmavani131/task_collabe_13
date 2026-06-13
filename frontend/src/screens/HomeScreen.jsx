import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <Meta />

      <style>{`
        .home-wrapper{
          background:#f8fafc;
          min-height:100vh;
        }

        .hero-section{
          background:linear-gradient(135deg,#0f172a,#1e293b);
          border-radius:24px;
          padding:70px 50px;
          color:white;
          margin:30px 0 50px;
          position:relative;
          overflow:hidden;
        }

        .hero-section::before{
          content:'';
          position:absolute;
          width:300px;
          height:300px;
          border-radius:50%;
          background:rgba(255,255,255,.05);
          top:-120px;
          right:-100px;
        }

        .hero-title{
          font-size:3rem;
          font-weight:800;
          margin-bottom:15px;
        }

        .hero-subtitle{
          max-width:650px;
          color:#cbd5e1;
          font-size:1.1rem;
        }

        .feature-card{
          background:#fff;
          border-radius:20px;
          padding:25px;
          text-align:center;
          box-shadow:0 10px 25px rgba(0,0,0,.08);
          transition:.3s;
          height:100%;
        }

        .feature-card:hover{
          transform:translateY(-8px);
        }

        .feature-icon{
          font-size:2.3rem;
          margin-bottom:10px;
        }

        .stats-card{
          background:white;
          border-radius:20px;
          padding:25px;
          text-align:center;
          box-shadow:0 10px 25px rgba(0,0,0,.06);
        }

        .stats-number{
          font-size:2rem;
          font-weight:700;
          color:#0f172a;
        }

        .products-header{
          display:flex;
          justify-content:space-between;
          align-items:end;
          margin-bottom:40px;
          padding-bottom:20px;
          border-bottom:1px solid #e5e7eb;
        }

        .section-badge{
          display:inline-block;
          background:#dbeafe;
          color:#2563eb;
          font-size:.75rem;
          font-weight:700;
          padding:6px 14px;
          border-radius:30px;
          margin-bottom:15px;
          letter-spacing:1px;
        }

        .section-title{
          font-size:3rem;
          font-weight:800;
          color:#0f172a;
          margin-bottom:10px;
          line-height:1;
        }

        .section-subtitle{
          font-size:1.1rem;
          color:#64748b;
          max-width:650px;
          margin:0;
        }

        .products-count{
          background:white;
          padding:12px 20px;
          border-radius:14px;
          font-weight:600;
          box-shadow:0 5px 15px rgba(0,0,0,.08);
          color:#334155;
        }

        .product-box{
          transition:.3s;
        }

        .product-box:hover{
          transform:translateY(-8px);
        }

        .pagination-wrapper{
          display:flex;
          justify-content:center;
          margin-top:50px;
          padding-bottom:30px;
        }

        .back-btn{
          border-radius:50px;
          padding:10px 25px;
          font-weight:600;
        }

        @media(max-width:768px){

          .hero-section{
            padding:40px 25px;
          }

          .hero-title{
            font-size:2rem;
          }

          .products-header{
            flex-direction:column;
            align-items:flex-start;
            gap:20px;
          }

          .section-title{
            font-size:2.2rem;
          }

          .section-subtitle{
            font-size:1rem;
          }
        }
      `}</style>

      <div className="home-wrapper">
        {!keyword ? (
          <>
            <ProductCarousel />

            <Container>
              <div className="hero-section">
                <h1 className="hero-title">
                  Discover Premium Electronics
                </h1>

                <p className="hero-subtitle">
                  Shop the latest gaming consoles, smartphones,
                  accessories and premium technology products
                  with fast delivery and trusted quality.
                </p>
              </div>

              <Row className="g-4 mb-5">
                <Col md={4}>
                  <div className="feature-card">
                    <div className="feature-icon"></div>
                    <h5>Fast Delivery</h5>
                    <p className="text-muted mb-0">
                      Quick shipping on every order.
                    </p>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="feature-card">
                    <div className="feature-icon"></div>
                    <h5>Secure Payment</h5>
                    <p className="text-muted mb-0">
                      Safe and protected checkout.
                    </p>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="feature-card">
                    <div className="feature-icon"></div>
                    <h5>Top Rated Products</h5>
                    <p className="text-muted mb-0">
                      Loved by thousands of customers.
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          </>
        ) : (
          <Container className="mt-4">
            <Link
              to="/"
              className="btn btn-outline-dark back-btn mb-4"
            >
              ← Go Back
            </Link>
          </Container>
        )}

        <Container>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <>
              <Row className="g-4 mb-5">
                <Col md={4}>
                  <div className="stats-card">
                    <div className="stats-number">
                      {data.products.length}
                    </div>
                    <div>Products</div>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="stats-card">
                    <div className="stats-number">
                      {data.page}
                    </div>
                    <div>Current Page</div>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="stats-card">
                    <div className="stats-number">
                      {data.pages}
                    </div>
                    <div>Total Pages</div>
                  </div>
                </Col>
              </Row>

              <div className="products-header">
                <div>
                  <span className="section-badge">
                    NEW ARRIVALS
                  </span>

                  <h2 className="section-title">
                    Latest Products
                  </h2>

                  <p className="section-subtitle">
                    Discover premium products carefully selected
                    for quality, performance and customer satisfaction.
                  </p>
                </div>

                <div className="products-count">
                  {data.products.length} Products
                </div>
              </div>

              <Row className="g-4">
                {data.products.map((product) => (
                  <Col
                    key={product._id}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                  >
                    <div className="product-box">
                      <Product product={product} />
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="pagination-wrapper">
                <Paginate
                  pages={data.pages}
                  page={data.page}
                  keyword={keyword ? keyword : ''}
                />
              </div>
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default HomeScreen;
