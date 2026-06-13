import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Image,
  ListGroup,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  const subtotal = cartItems
    .reduce((total, item) => total + item.qty * item.price, 0)
    .toFixed(2);

  const updateQuantityHandler = (product, quantity) => {
    dispatch(
      addToCart({
        ...product,
        qty: quantity,
      })
    );
  };

  const deleteItemHandler = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const proceedToCheckoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  // Calculations (safe)
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  return (
    <Row>
      {/* Cart Items */}
      <Col lg={8}>
        <h1 className="mb-4">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty. <Link to="/">Continue Shopping</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map(
              ({
                _id,
                image,
                name,
                price,
                qty,
                countInStock,
              }) => (
                <ListGroup.Item key={_id}>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image
                        src={image}
                        alt={name}
                        fluid
                        rounded
                      />
                    </Col>

                    <Col md={3}>
                      <Link to={`/product/${_id}`}>
                        {name}
                      </Link>
                    </Col>

                    <Col md={2}>${price}</Col>

                    <Col md={3}>
                      <Form.Select
                        value={qty}
                        onChange={(e) =>
                          updateQuantityHandler(
                            {
                              _id,
                              image,
                              name,
                              price,
                              countInStock,
                            },
                            Number(e.target.value)
                          )
                        }
                      >
                        {[...Array(countInStock).keys()].map(
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

                    <Col md={2}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          deleteItemHandler(_id)
                        }
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )
            )}
          </ListGroup>
        )}
      </Col>

      {/* Order Summary */}
      <Col lg={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order Summary</h2>

              <p className="mb-1">
                <strong>Items:</strong> {totalItems}
              </p>

              <p className="mb-0">
                <strong>Subtotal:</strong> ${subtotal}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <Button
                className="w-100"
                disabled={!cartItems.length}
                onClick={proceedToCheckoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>

          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;