import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { userInfo } = useSelector((state) => state.auth);

  const [loginUser, { isLoading }] = useLoginMutation();

  const redirect = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirect') || '/';
  }, [location.search]);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await loginUser(formData).unwrap();

      dispatch(setCredentials(userData));

      navigate(redirect);
    } catch (error) {
      toast.error(
        error?.data?.message || 'Invalid email or password'
      );
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="mt-3">
        <Col>
          New Customer?{' '}
          <Link
            to={
              redirect
                ? `/register?redirect=${redirect}`
                : '/register'
            }
          >
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;