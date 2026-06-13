import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems = [] } = useSelector((state) => state.cart);

  // Quantity change handler
  const handleQtyChange = (item, qty) => {
    dispatch(addToCart({ ...item, qty }));
  };

  // Remove item handler
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  // Checkout
  const handleCheckout = () => {
    navigate('/login?redirect=/shipping');
  };

  // Calculations (safe)
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  return (
    <Row>
      {/* LEFT SIDE */}
      <Col md={8}>
        <h1 className="mb-3">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className="align-items-center">
                  
                  <Col md={2}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fluid
                      rounded
                    />
                  </Col>

                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>
                      {item.name}
                    </Link>
                  </Col>

                  <Col md={2}>${item.price}</Col>

                  <Col md={2}>
                    <Form.Select
                      value={item.qty}
                      onChange={(e) =>
                        handleQtyChange(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={2}>
                    <Button
                      variant="light"
                      onClick={() => handleRemove(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>

                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      {/* RIGHT SIDE */}
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">

            <ListGroup.Item>
              <h2>
                Subtotal ({totalItems}) items
              </h2>
              ${totalPrice}
            </ListGroup.Item>

            <ListGroup.Item>
              <Button
                className="w-100"
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
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