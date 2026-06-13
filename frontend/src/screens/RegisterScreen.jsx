import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [registerUser, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const redirect = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirect') || '/';
  }, [location.search]);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const userData = await registerUser({ name, email, password }).unwrap();
      dispatch(setCredentials(userData));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || 'Registration failed');
    }
  };

  return (
    <FormContainer>
      <h1>Create Account</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='name' className='mb-3'>
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type='text'
            name='name'
            placeholder='Enter your name'
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId='email' className='mb-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            name='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId='password' className='mb-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            name='password'
            placeholder='Enter password'
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId='confirmPassword' className='mb-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            name='confirmPassword'
            placeholder='Confirm password'
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type='submit' variant='primary' disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Register'}
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='mt-3'>
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;