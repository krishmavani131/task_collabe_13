import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Badge,
} from 'react-bootstrap';
import {
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Message from '../components/Message';
import Loader from '../components/Loader';
import CheckoutSteps from '../components/CheckoutSteps';

import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] =
    usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector(
    (state) => state.auth
  );

  const [{ isPending }, paypalDispatch] =
    usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (
      !errorPayPal &&
      !loadingPayPal &&
      paypal?.clientId
    ) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });

        paypalDispatch({
          type: 'setLoadingStatus',
          value: 'pending',
        });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [
    errorPayPal,
    loadingPayPal,
    order,
    paypal,
    paypalDispatch,
  ]);

  function onApprove(data, actions) {
    return actions.order
      .capture()
      .then(async function (details) {
        try {
          await payOrder({
            orderId,
            details,
          });

          refetch();

          toast.success('Order Paid Successfully');
        } catch (err) {
          toast.error(
            err?.data?.message || err.error
          );
        }
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderID) => orderID);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
    toast.success('Order Delivered');
  };

  if (isLoading) return <Loader />;

  if (error)
    return (
      <Message variant='danger'>
        {error?.data?.message}
      </Message>
    );

  return (
    <div
      style={{
        maxWidth: '1300px',
        margin: '30px auto',
      }}
    >
      <h1
        className='mb-4 fw-bold'
        style={{
          fontSize: '2rem',
        }}
      >
        Order Details
      </h1>

      <CheckoutSteps
        step1
        step2
        step3
        step4
      />

      <Row className='g-4 mt-2'>
        {/* LEFT */}
        <Col lg={8}>
          {/* Shipping */}
          <Card
            className='border-0 shadow-sm mb-4'
            style={{
              borderRadius: '20px',
            }}
          >
            <Card.Body className='p-4'>
              <h4 className='fw-bold mb-3'>
                🚚 Shipping Information
              </h4>

              <p>
                <strong>Name:</strong>{' '}
                {order.user.name}
              </p>

              <p>
                <strong>Email:</strong>{' '}
                <a
                  href={`mailto:${order.user.email}`}
                >
                  {order.user.email}
                </a>
              </p>

              <p>
                <strong>Address:</strong>{' '}
                {order.shippingAddress.address},{' '}
                {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Badge bg='success' className='p-2'>
                  Delivered on {order.deliveredAt}
                </Badge>
              ) : (
                <Badge bg='danger' className='p-2'>
                  Not Delivered
                </Badge>
              )}
            </Card.Body>
          </Card>

          {/* Payment */}
          <Card
            className='border-0 shadow-sm mb-4'
            style={{
              borderRadius: '20px',
            }}
          >
            <Card.Body className='p-4'>
              <h4 className='fw-bold mb-3'>
                💳 Payment Information
              </h4>

              <p>
                <strong>Method:</strong>{' '}
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Badge bg='success' className='p-2'>
                  Paid on {order.paidAt}
                </Badge>
              ) : (
                <Badge bg='warning' text='dark'>
                  Payment Pending
                </Badge>
              )}
            </Card.Body>
          </Card>

          {/* Items */}
          <Card
            className='border-0 shadow-sm'
            style={{
              borderRadius: '20px',
            }}
          >
            <Card.Body className='p-4'>
              <h4 className='fw-bold mb-4'>
                🛍️ Order Items
              </h4>

              {order.orderItems.length === 0 ? (
                <Message>
                  No items found.
                </Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map(
                    (item, index) => (
                      <ListGroup.Item
                        key={index}
                        className='py-3'
                      >
                        <Row className='align-items-center'>
                          <Col md={2}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                              style={{
                                maxHeight: '80px',
                                objectFit: 'cover',
                              }}
                            />
                          </Col>

                          <Col md={6}>
                            <Link
                              to={`/product/${item.product}`}
                              className='fw-semibold text-decoration-none'
                            >
                              {item.name}
                            </Link>
                          </Col>

                          <Col
                            md={4}
                            className='text-end fw-bold'
                          >
                            {item.qty} × $
                            {item.price} = $
                            {(
                              item.qty *
                              item.price
                            ).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )
                  )}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col lg={4}>
          <Card
            className='border-0 shadow-lg'
            style={{
              borderRadius: '20px',
              position: 'sticky',
              top: '20px',
            }}
          >
            <Card.Body className='p-4'>
              <h4 className='fw-bold mb-4'>
                Order Summary
              </h4>

              <div className='d-flex justify-content-between mb-3'>
                <span>Items</span>
                <strong>
                  ${order.itemsPrice}
                </strong>
              </div>

              <div className='d-flex justify-content-between mb-3'>
                <span>Shipping</span>
                <strong>
                  ${order.shippingPrice}
                </strong>
              </div>

              <div className='d-flex justify-content-between mb-3'>
                <span>Tax</span>
                <strong>
                  ${order.taxPrice}
                </strong>
              </div>

              <hr />

              <div className='d-flex justify-content-between mb-4'>
                <h5>Total</h5>
                <h5 className='fw-bold text-primary'>
                  ${order.totalPrice}
                </h5>
              </div>

              {!order.isPaid && (
                <>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <PayPalButtons
                      createOrder={
                        createOrder
                      }
                      onApprove={
                        onApprove
                      }
                      onError={onError}
                    />
                  )}
                </>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <Button
                    className='w-100 mt-4'
                    variant='success'
                    size='lg'
                    onClick={
                      deliverHandler
                    }
                    style={{
                      borderRadius:
                        '12px',
                    }}
                  >
                    Mark As Delivered
                  </Button>
                )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;