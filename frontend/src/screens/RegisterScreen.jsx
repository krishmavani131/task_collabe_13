<<<<<<< Updated upstream
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
=======
import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

>>>>>>> Stashed changes
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
<<<<<<< Updated upstream
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
=======

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
>>>>>>> Stashed changes

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
<<<<<<< Updated upstream
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
=======
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
      const userData = await registerUser({
        name,
        email,
        password,
      }).unwrap();

      dispatch(setCredentials(userData));

      navigate(redirect);
    } catch (error) {
      toast.error(
        error?.data?.message || 'Registration failed'
      );
>>>>>>> Stashed changes
    }
  };

  return (
    <FormContainer>
<<<<<<< Updated upstream
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button disabled={isLoading} type='submit' variant='primary'>
          Register
=======
      <h1>Create Account</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
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

        <Form.Group controlId="confirmPassword" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Register'}
>>>>>>> Stashed changes
        </Button>

        {isLoading && <Loader />}
      </Form>

<<<<<<< Updated upstream
      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
=======
      <Row className="mt-3">
        <Col>
          Already have an account?{' '}
          <Link
            to={
              redirect
                ? `/login?redirect=${redirect}`
                : '/login'
            }
          >
>>>>>>> Stashed changes
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

<<<<<<< Updated upstream
export default RegisterScreen;
=======
export default RegisterScreen;
>>>>>>> Stashed changes
