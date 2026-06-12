import { useState } from 'react';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(
    shippingAddress.address || ''
  );
  const [city, setCity] = useState(
    shippingAddress.city || ''
  );
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(
    shippingAddress.country || ''
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
      })
    );

    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />

      <div
        style={{
          maxWidth: '1100px',
          margin: '40px auto',
        }}
      >
        <Row className='g-4'>
          {/* Main Form */}
          <Col lg={8}>
            <Card
              className='border-0 shadow-sm'
              style={{
                borderRadius: '24px',
              }}
            >
              <Card.Body
                style={{
                  padding: '3rem',
                }}
              >
                <div className='mb-5'>
                  <span
                    style={{
                      color: '#6b7280',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontWeight: '600',
                    }}
                  >
                    Checkout
                  </span>

                  <h2
                    className='mt-2'
                    style={{
                      fontWeight: '700',
                    }}
                  >
                    Shipping Address
                  </h2>

                  <p
                    style={{
                      color: '#6b7280',
                      marginBottom: 0,
                    }}
                  >
                    Please enter your delivery information.
                  </p>
                </div>

                <Form onSubmit={submitHandler}>
                  <Form.Group
                    className='mb-4'
                    controlId='address'
                  >
                    <Form.Label className='fw-semibold'>
                      Street Address
                    </Form.Label>

                    <Form.Control
                      type='text'
                      size='lg'
                      value={address}
                      placeholder='123 Main Street'
                      required
                      onChange={(e) =>
                        setAddress(e.target.value)
                      }
                      style={{
                        borderRadius: '14px',
                        padding: '14px',
                      }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group
                        className='mb-4'
                        controlId='city'
                      >
                        <Form.Label className='fw-semibold'>
                          City
                        </Form.Label>

                        <Form.Control
                          type='text'
                          size='lg'
                          value={city}
                          placeholder='New York'
                          required
                          onChange={(e) =>
                            setCity(e.target.value)
                          }
                          style={{
                            borderRadius: '14px',
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group
                        className='mb-4'
                        controlId='postalCode'
                      >
                        <Form.Label className='fw-semibold'>
                          Postal Code
                        </Form.Label>

                        <Form.Control
                          type='text'
                          size='lg'
                          value={postalCode}
                          placeholder='10001'
                          required
                          onChange={(e) =>
                            setPostalCode(e.target.value)
                          }
                          style={{
                            borderRadius: '14px',
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group
                    className='mb-5'
                    controlId='country'
                  >
                    <Form.Label className='fw-semibold'>
                      Country
                    </Form.Label>

                    <Form.Control
                      type='text'
                      size='lg'
                      value={country}
                      placeholder='United States'
                      required
                      onChange={(e) =>
                        setCountry(e.target.value)
                      }
                      style={{
                        borderRadius: '14px',
                      }}
                    />
                  </Form.Group>

                  <Button
                    type='submit'
                    size='lg'
                    className='w-100'
                    style={{
                      borderRadius: '14px',
                      padding: '14px',
                      fontWeight: '600',
                      fontSize: '1rem',
                    }}
                  >
                    Continue to Payment
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Side Information Panel */}
          <Col lg={4}>
            <Card
              className='border-0 shadow-sm h-100'
              style={{
                borderRadius: '24px',
              }}
            >
              <Card.Body
                style={{
                  padding: '2rem',
                }}
              >
                <h5
                  className='fw-bold mb-4'
                >
                  Order Benefits
                </h5>

                <div className='mb-4'>
                  <h6 className='fw-semibold'>
                    Secure Checkout
                  </h6>

                  <p className='text-muted mb-0'>
                    Your payment and shipping data are
                    protected with industry-standard
                    encryption.
                  </p>
                </div>

                <hr />

                <div className='mb-4'>
                  <h6 className='fw-semibold'>
                    Fast Delivery
                  </h6>

                  <p className='text-muted mb-0'>
                    Real-time tracking and reliable
                    shipping partners.
                  </p>
                </div>

                <hr />

                <div>
                  <h6 className='fw-semibold'>
                    Easy Returns
                  </h6>

                  <p className='text-muted mb-0'>
                    Quick returns and dedicated customer
                    support whenever you need help.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </FormContainer>
  );
};

export default ShippingScreen;