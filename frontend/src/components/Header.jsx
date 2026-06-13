import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';

const getCartItemCount = (cartItems) =>
  cartItems.reduce((total, item) => total + item.qty, 0);

const CartLink = ({ itemCount }) => (
  <Nav.Link as={Link} to='/cart'>
    <FaShoppingCart /> Cart
    {itemCount > 0 && (
      <Badge pill bg='success' style={{ marginLeft: '5px' }}>
        {itemCount}
      </Badge>
    )}
  </Nav.Link>
);

const AdminMenu = () => (
  <NavDropdown title='Admin' id='adminmenu'>
    <NavDropdown.Item as={Link} to='/admin/productlist'>
      Products
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to='/admin/orderlist'>
      Orders
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to='/admin/userlist'>
      Users
    </NavDropdown.Item>
  </NavDropdown>
);

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // Reset the cart on logout so the next user doesn't inherit it
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            <img src={logo} alt='ProShop' />
            ProShop
          </Navbar.Brand>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />

          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <SearchBox />

              <CartLink itemCount={getCartItemCount(cartItems)} />

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <NavDropdown.Item as={Link} to='/profile'>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to='/login'>
                  <FaUser /> Sign In
                </Nav.Link>
              )}

              {userInfo?.isAdmin && <AdminMenu />}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
