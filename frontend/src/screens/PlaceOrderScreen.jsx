import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';

import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Destructure for clean code
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // ✅ Redirect logic
  useEffect(() => {
    if (!shippingAddress?.address) return navigate('/shipping');
    if (!paymentMethod) return navigate('/payment');
  }, [shippingAddress, paymentMethod, navigate]);

  // ✅ Order API call
  const placeOrderHandler = async () => {
    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const res = await createOrder(orderData).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  // ✅ Reusable Item Row
  const renderCartItems = () =>
    cartItems.map((item, index) => (
      <ListGroup.Item key={index}>
        <Row className="align-items-center">
          <Col md={1}>
            <Image src={item.image} alt={item.name} fluid rounded />
          </Col>

          <Col>
            <Link to={`/product/${item.product}`}>{item.name}</Link>
          </Col>

          <Col md={4}>
            {item.qty} × ${item.price} = $
            {(item.qty * item.price).toFixed(2)}
          </Col>
        </Row>
      </ListGroup.Item>
    ));

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        {/* LEFT SIDE */}
        <Col md={8}>
          <ListGroup variant="flush">

            {/* Shipping */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>{' '}
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
            </ListGroup.Item>

            {/* Payment */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong> {paymentMethod}
            </ListGroup.Item>

            {/* Items */}
            <ListGroup.Item>
              <h2>Order Items</h2>

              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {renderCartItems()}
                </ListGroup>
              )}
            </ListGroup.Item>

          </ListGroup>
        </Col>

        {/* RIGHT SIDE */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">

              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* Error */}
              {error && (
                <ListGroup.Item>
                  <Message variant="danger">
                    {error?.data?.message || 'Something went wrong'}
                  </Message>
                </ListGroup.Item>
              )}

              {/* Button */}
              <ListGroup.Item>
                <Button
                  type="button"
                  className="w-100"
                  disabled={cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>

                {isLoading && <Loader />}
              </ListGroup.Item>

            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;