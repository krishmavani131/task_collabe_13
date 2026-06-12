import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
  <>
    <CheckoutSteps step1 step2 step3 step4 />

    <div
      style={{
        maxWidth: '1400px',
        margin: '40px auto',
      }}
    >
      <Row className='g-4'>
        {/* LEFT SIDE */}
        <Col lg={8}>
          {/* SHIPPING */}
          <Card
            className='border-0 shadow-sm mb-4'
            style={{
              borderRadius: '20px',
            }}
          >
            <Card.Body className='p-4'>
              <h4 className='fw-bold mb-3'>
                📦 Shipping Information
              </h4>

              <div className='text-muted'>
                <strong>Address:</strong>
                <br />
                {cart.shippingAddress.address},
                {' '}
                {cart.shippingAddress.city},
                {' '}
                {cart.shippingAddress.postalCode},
                {' '}
                {cart.shippingAddress.country}
              </div>
            </Card.Body>
          </Card>

          {/* PAYMENT */}
          <Card
            className='border-0 shadow-sm mb-4'
            style={{
              borderRadius: '20px',
            }}
          >
            <Card.Body className='p-4'>
              <h4 className='fw-bold mb-3'>
                💳 Payment Method
              </h4>

              <span
                className='badge bg-success px-3 py-2'
                style={{
                  fontSize: '0.9rem',
                }}
              >
                {cart.paymentMethod}
              </span>
            </Card.Body>
          </Card>

          {/* ORDER ITEMS */}
          <Card
            className='border-0 shadow-sm'
            style={{
              borderRadius: '20px',
            }}
          >
            <Card.Body className='p-4'>
              <div className='d-flex justify-content-between align-items-center mb-4'>
                <h4 className='fw-bold mb-0'>
                  🛒 Order Items
                </h4>

                <span className='badge bg-primary'>
                  {cart.cartItems.length} Items
                </span>
              </div>

              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className='py-3 px-0'
                    >
                      <Row className='align-items-center'>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                            style={{
                              height: '90px',
                              width: '90px',
                              objectFit: 'cover',
                            }}
                          />
                        </Col>

                        <Col md={6}>
                          <Link
                            to={`/product/${item.product}`}
                            className='text-decoration-none fw-semibold'
                            style={{
                              color: '#111827',
                              fontSize: '1rem',
                            }}
                          >
                            {item.name}
                          </Link>
                        </Col>

                        <Col
                          md={4}
                          className='text-end fw-semibold'
                        >
                          {item.qty} × ${item.price}
                          <div
                            className='text-primary mt-1'
                            style={{
                              fontSize: '1.1rem',
                            }}
                          >
                            $
                            {(
                              item.qty * item.price
                            ).toFixed(2)}
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT SIDE */}
        <Col lg={4}>
          <Card
            className='border-0 shadow-lg'
            style={{
              borderRadius: '24px',
              position: 'sticky',
              top: '20px',
            }}
          >
            <Card.Body className='p-4'>
              <h3
                className='fw-bold mb-4 text-center'
              >
                Order Summary
              </h3>

              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col className='text-end fw-semibold'>
                      ${cart.itemsPrice}
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col className='text-end fw-semibold'>
                      ${cart.shippingPrice}
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col className='text-end fw-semibold'>
                      ${cart.taxPrice}
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>

                    <Col className='text-end'>
                      <strong
                        style={{
                          fontSize: '1.4rem',
                          color: '#0d6efd',
                        }}
                      >
                        ${cart.totalPrice}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {error && (
                  <ListGroup.Item>
                    <Message variant='danger'>
                      {error?.data?.message}
                    </Message>
                  </ListGroup.Item>
                )}

                <ListGroup.Item className='border-0 pt-4'>
                  <Button
                    type='button'
                    disabled={
                      cart.cartItems.length === 0
                    }
                    onClick={placeOrderHandler}
                    className='w-100'
                    style={{
                      padding: '15px',
                      borderRadius: '14px',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '1.05rem',
                      background:
                        'linear-gradient(135deg,#2563eb,#1d4ed8)',
                    }}
                  >
                    🚀 Place Order
                  </Button>

                  {isLoading && (
                    <div className='mt-3 text-center'>
                      <Loader />
                    </div>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  </>
);
};
export default PlaceOrderScreen;
