import { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] =
    useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));

    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <div
        style={{
          maxWidth: '1200px',
          margin: '40px auto',
        }}
      >
        <Row className='g-4'>
          {/* LEFT SECTION */}
          <Col lg={8}>
            <Card
              className='border-0 shadow'
              style={{
                borderRadius: '24px',
              }}
            >
              <Card.Body
                style={{
                  padding: '3rem',
                }}
              >
                {/* HEADER */}
                <div className='mb-5'>
                  <Badge
                    bg='primary'
                    className='px-3 py-2 mb-3'
                  >
                    CHECKOUT STEP 3
                  </Badge>

                  <h2
                    style={{
                      fontWeight: '700',
                    }}
                  >
                    Select Payment Method
                  </h2>

                  <p
                    style={{
                      color: '#6b7280',
                    }}
                  >
                    Choose a secure payment option to
                    complete your purchase.
                  </p>
                </div>

                <Form onSubmit={submitHandler}>
                  {/* PAYMENT CARD */}
                  <Card
                    className={`mb-4 shadow-sm ${
                      paymentMethod === 'PayPal'
                        ? 'border-primary border-2'
                        : ''
                    }`}
                    style={{
                      borderRadius: '18px',
                      cursor: 'pointer',
                      transition: 'all .3s ease',
                    }}
                    onClick={() =>
                      setPaymentMethod('PayPal')
                    }
                  >
                    <Card.Body>
                      <Row className='align-items-center'>
                        <Col md={8}>
                          <Form.Check
                            type='radio'
                            id='paypal'
                            name='paymentMethod'
                            value='PayPal'
                            checked={
                              paymentMethod ===
                              'PayPal'
                            }
                            onChange={(e) =>
                              setPaymentMethod(
                                e.target.value
                              )
                            }
                            label={
                              <span
                                style={{
                                  fontWeight: '700',
                                  fontSize: '1.1rem',
                                }}
                              >
                                PayPal / Credit Card
                              </span>
                            }
                          />

                          <p
                            className='text-muted mt-2 mb-0'
                            style={{
                              marginLeft: '25px',
                            }}
                          >
                            Secure checkout using
                            PayPal, Visa, Mastercard,
                            American Express and Debit
                            Cards.
                          </p>
                        </Col>

                        <Col
                          md={4}
                          className='text-md-end mt-3 mt-md-0'
                        >
                          <div
                            style={{
                              fontSize: '2rem',
                            }}
                          >
                            💳 🅿️
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  {/* BENEFITS */}
                  <Card
                    className='border-0 mb-4'
                    style={{
                      background: '#f8fafc',
                      borderRadius: '18px',
                    }}
                  >
                    <Card.Body>
                      <Row className='text-center'>
                        <Col md={4}>
                          <div
                            style={{
                              fontSize: '2rem',
                            }}
                          >
                            🔒
                          </div>

                          <h6 className='mt-2 fw-bold'>
                            SSL Secure
                          </h6>

                          <small className='text-muted'>
                            256-bit encrypted payments
                          </small>
                        </Col>

                        <Col md={4}>
                          <div
                            style={{
                              fontSize: '2rem',
                            }}
                          >
                            ⚡
                          </div>

                          <h6 className='mt-2 fw-bold'>
                            Fast Checkout
                          </h6>

                          <small className='text-muted'>
                            Quick and seamless process
                          </small>
                        </Col>

                        <Col md={4}>
                          <div
                            style={{
                              fontSize: '2rem',
                            }}
                          >
                            🛡️
                          </div>

                          <h6 className='mt-2 fw-bold'>
                            Buyer Protection
                          </h6>

                          <small className='text-muted'>
                            Purchase covered by policy
                          </small>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  {/* ACCEPTED METHODS */}
                  <Card
                    className='border-0 mb-4'
                    style={{
                      borderRadius: '18px',
                      background:
                        'linear-gradient(135deg,#f8fafc,#ffffff)',
                    }}
                  >
                    <Card.Body>
                      <h6 className='fw-bold mb-3'>
                        Accepted Payment Methods
                      </h6>

                      <div
                        className='d-flex justify-content-between align-items-center'
                        style={{
                          fontSize: '1.3rem',
                        }}
                      >
                        <span>💳 Visa</span>
                        <span>💳 Mastercard</span>
                        <span>🅿️ PayPal</span>
                      </div>

                      <hr />

                      <small className='text-muted'>
                        We support all major credit
                        cards, debit cards and PayPal
                        accounts.
                      </small>
                    </Card.Body>
                  </Card>

                  {/* ORDER NOTE */}
                  <div
                    className='mb-4 p-3'
                    style={{
                      borderRadius: '14px',
                      background: '#eff6ff',
                      border:
                        '1px solid rgba(13,110,253,.2)',
                    }}
                  >
                    <strong>💡 Note:</strong> You won't
                    be charged until your order is
                    confirmed.
                  </div>

                  {/* BUTTON */}
                  <Button
                    type='submit'
                    size='lg'
                    className='w-100 shadow'
                    style={{
                      borderRadius: '14px',
                      padding: '16px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Continue to Review Order →
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT SECTION */}
          <Col lg={4}>
            <Card
              className='border-0 shadow h-100'
              style={{
                borderRadius: '24px',
              }}
            >
              <Card.Body
                style={{
                  padding: '2rem',
                }}
              >
                <h5 className='fw-bold mb-4'>
                  Payment Security
                </h5>

                <div className='mb-4'>
                  <h6 className='fw-semibold'>
                    🔒 Encrypted Transactions
                  </h6>

                  <p className='text-muted mb-0'>
                    Your payment information is
                    protected using advanced SSL
                    encryption.
                  </p>
                </div>

                <hr />

                <div className='mb-4'>
                  <h6 className='fw-semibold'>
                    🌎 Trusted Providers
                  </h6>

                  <p className='text-muted mb-0'>
                    Payments are processed through
                    globally trusted gateways.
                  </p>
                </div>

                <hr />

                <div className='mb-4'>
                  <h6 className='fw-semibold'>
                    🛡️ Buyer Protection
                  </h6>

                  <p className='text-muted mb-0'>
                    Eligible purchases are covered by
                    payment provider protection
                    policies.
                  </p>
                </div>

                <hr />

                <div>
                  <h6 className='fw-semibold mb-3'>
                    Checkout Progress
                  </h6>

                  <div className='d-flex justify-content-between mb-2'>
                    <span>Login</span>
                    <span className='text-success'>
                      ✓
                    </span>
                  </div>

                  <div className='d-flex justify-content-between mb-2'>
                    <span>Shipping</span>
                    <span className='text-success'>
                      ✓
                    </span>
                  </div>

                  <div className='d-flex justify-content-between mb-2'>
                    <span>Payment</span>
                    <span className='text-primary'>
                      ●
                    </span>
                  </div>

                  <div className='d-flex justify-content-between'>
                    <span>Place Order</span>
                    <span>○</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </FormContainer>
  );
};

export default PaymentScreen;