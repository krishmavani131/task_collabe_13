import React, { useState } from 'react';
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
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Local state
  const [qty, setQty] = useState(1);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
  });

  // ✅ API
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(id);

  const [createReview, { isLoading: loadingReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // ✅ Handlers
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId: id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      }).unwrap();

      toast.success('Review Added');
      setReviewData({ rating: 0, comment: '' });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  // ✅ Qty options
  const renderQtyOptions = () =>
    [...Array(product.countInStock).keys()].map((x) => (
      <option key={x + 1} value={x + 1}>
        {x + 1}
      </option>
    ));

  // ✅ Reviews list
  const renderReviews = () =>
    product.reviews.map((rev) => (
      <ListGroup.Item key={rev._id}>
        <strong>{rev.name}</strong>
        <Rating value={rev.rating} />
        <p>{rev.createdAt?.substring(0, 10)}</p>
        <p>{rev.comment}</p>
      </ListGroup.Item>
    ));

  return (
    <>
      <Link to='/' className='btn btn-light my-3'>
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />

          <Row>
            {/* IMAGE */}
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            {/* DETAILS */}
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>

                <ListGroup.Item>
                  Price: ${product.price}
                </ListGroup.Item>

                <ListGroup.Item>
                  {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            {/* BUY CARD */}
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>

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
                        {product.countInStock > 0
                          ? 'In Stock'
                          : 'Out Of Stock'}
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
                            {renderQtyOptions()}
                          </Form.Select>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className='w-100'
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
          <Row className='mt-4'>
            <Col md={6}>
              <h2>Reviews</h2>

              {product.reviews.length === 0 && (
                <Message>No Reviews</Message>
              )}

              <ListGroup variant='flush'>
                {renderReviews()}

                {/* REVIEW FORM */}
                <ListGroup.Item>
                  <h2>Write a Review</h2>

                  {loadingReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitReviewHandler}>

                      <Form.Group className='my-2'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          value={reviewData.rating}
                          required
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              rating: Number(e.target.value),
                            })
                          }
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className='my-2'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          required
                          value={reviewData.comment}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              comment: e.target.value,
                            })
                          }
                        />
                      </Form.Group>

                      <Button
                        type='submit'
                        disabled={loadingReview}
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to review
                    </Message>
                  )}
                </ListGroup.Item>

              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;