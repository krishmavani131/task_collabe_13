import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Container,
  Badge,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';

import { addToCart } from '../slices/cartSlice';

import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();

      refetch();

      setRating(0);
      setComment('');

      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Meta title={product?.name} description={product?.description} />

      <style>{`
        .product-page {
          background: #f8fafc;
          min-height: 100vh;
          padding-bottom: 50px;
        }

        .back-btn {
          border-radius: 50px;
          padding: 10px 25px;
          font-weight: 600;
          border: none;
          box-shadow: 0 5px 15px rgba(0,0,0,.08);
        }

        .image-card {
          background: white;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(0,0,0,.08);
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          transition: .4s ease;
        }

        .product-image:hover {
          transform: scale(1.05);
        }

        .info-card {
          background: white;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(0,0,0,.08);
          height: 100%;
        }

        .product-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 15px;
        }

        .price-tag {
          font-size: 2rem;
          font-weight: 800;
          color: #2563eb;
          margin: 15px 0;
        }

        .description {
          color: #64748b;
          line-height: 1.8;
          margin-top: 15px;
        }

        .purchase-card {
          border: none;
          border-radius: 24px;
          box-shadow: 0 15px 35px rgba(0,0,0,.08);
          position: sticky;
          top: 100px;
        }

        .purchase-card .list-group-item {
          padding: 18px;
        }

        .stock-badge {
          font-size: .85rem;
          padding: 8px 12px;
          border-radius: 50px;
        }

        .buy-btn {
          width: 100%;
          border-radius: 12px;
          font-weight: 700;
          padding: 12px;
          font-size: 1rem;
        }

        .reviews-section {
          margin-top: 60px;
        }

        .review-title {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 25px;
        }

        .review-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 8px 20px rgba(0,0,0,.05);
        }

        .review-user {
          font-weight: 700;
          color: #111827;
        }

        .review-date {
          color: #94a3b8;
          font-size: .9rem;
          margin-top: 5px;
        }

        .review-comment {
          color: #475569;
          margin-top: 10px;
        }

        .review-form-card {
          background: white;
          border-radius: 24px;
          padding: 25px;
          margin-top: 25px;
          box-shadow: 0 10px 30px rgba(0,0,0,.06);
        }

        .form-control,
        .form-select {
          border-radius: 12px;
        }

        @media(max-width: 992px) {
          .purchase-card {
            position: relative;
            top: 0;
            margin-top: 25px;
          }

          .product-title {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <div className="product-page">
        <Container>
          <Link to="/" className="btn btn-light back-btn my-4">
            ← Go Back
          </Link>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <>
              <Row className="g-4">
                {/* IMAGE */}
                <Col lg={5}>
                  <div className="image-card">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fluid
                      className="product-image"
                    />
                  </div>
                </Col>

                {/* INFO */}
                <Col lg={4}>
                  <div className="info-card">
                    <h1 className="product-title">
                      {product.name}
                    </h1>

                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />

                    <div className="price-tag">
                      ${product.price}
                    </div>

                    <div className="description">
                      {product.description}
                    </div>
                  </div>
                </Col>

                {/* PURCHASE */}
                <Col lg={3}>
                  <Card className="purchase-card">
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col>Price</Col>
                          <Col>
                            <strong>${product.price}</strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <Col>Status</Col>
                          <Col>
                            {product.countInStock > 0 ? (
                              <Badge bg="success" className="stock-badge">
                                In Stock
                              </Badge>
                            ) : (
                              <Badge bg="danger" className="stock-badge">
                                Out Of Stock
                              </Badge>
                            )}
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>Qty</Col>
                            <Col>
                              <Form.Select
                                value={qty}
                                onChange={(e) =>
                                  setQty(Number(e.target.value))
                                }
                              >
                                {[...Array(product.countInStock).keys()].map(
                                  (x) => (
                                    <option
                                      key={x + 1}
                                      value={x + 1}
                                    >
                                      {x + 1}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )}

                      <ListGroup.Item>
                        <Button
                          className="buy-btn"
                          disabled={product.countInStock === 0}
                          onClick={addToCartHandler}
                        >
                          Add To Cart
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
              </Row>

              {/* REVIEWS */}
              <div className="reviews-section">
                <h2 className="review-title">
                  Customer Reviews
                </h2>

                {product.reviews.length === 0 && (
                  <Message>No Reviews Yet</Message>
                )}

                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="review-card"
                  >
                    <div className="review-user">
                      {review.name}
                    </div>

                    <Rating value={review.rating} />

                    <div className="review-date">
                      {review.createdAt.substring(0, 10)}
                    </div>

                    <div className="review-comment">
                      {review.comment}
                    </div>
                  </div>
                ))}

                <div className="review-form-card">
                  <h4 className="mb-4">
                    Write a Customer Review
                  </h4>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group
                        className="mb-3"
                        controlId="rating"
                      >
                        <Form.Label>Rating</Form.Label>

                        <Form.Select
                          required
                          value={rating}
                          onChange={(e) =>
                            setRating(e.target.value)
                          }
                        >
                          <option value="">
                            Select...
                          </option>
                          <option value="1">
                            1 - Poor
                          </option>
                          <option value="2">
                            2 - Fair
                          </option>
                          <option value="3">
                            3 - Good
                          </option>
                          <option value="4">
                            4 - Very Good
                          </option>
                          <option value="5">
                            5 - Excellent
                          </option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="comment"
                      >
                        <Form.Label>
                          Comment
                        </Form.Label>

                        <Form.Control
                          as="textarea"
                          rows={4}
                          required
                          value={comment}
                          onChange={(e) =>
                            setComment(e.target.value)
                          }
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        disabled={loadingProductReview}
                      >
                        Submit Review
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please{' '}
                      <Link to="/login">
                        sign in
                      </Link>{' '}
                      to write a review
                    </Message>
                  )}
                </div>
              </div>
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default ProductScreen;
