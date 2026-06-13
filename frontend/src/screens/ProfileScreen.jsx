import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Message from '../components/Message';
import Loader from '../components/Loader';

import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();

  // ✅ Combine form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders = [], isLoading, error } =
    useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdate }] =
    useProfileMutation();

  // ✅ Prefill data
  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.name,
        email: userInfo.email,
      }));
    }
  }, [userInfo]);

  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit
  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      const res = await updateProfile({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setCredentials(res));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  // ✅ Orders table rows
  const renderOrders = () =>
    orders.map((order) => (
      <tr key={order._id}>
        <td>{order._id}</td>
        <td>{order.createdAt?.substring(0, 10)}</td>
        <td>{order.totalPrice}</td>

        <td>
          {order.isPaid ? (
            order.paidAt?.substring(0, 10)
          ) : (
            <FaTimes color="red" />
          )}
        </td>

        <td>
          {order.isDelivered ? (
            order.deliveredAt?.substring(0, 10)
          ) : (
            <FaTimes color="red" />
          )}
        </td>

        <td>
          <Button
            as={Link}
            to={`/order/${order._id}`}
            size="sm"
            variant="light"
          >
            Details
          </Button>
        </td>
      </tr>
    ));

  return (
    <Row>
      {/* LEFT - PROFILE FORM */}
      <Col md={3}>
        <h2>User Profile</h2>

        <Form onSubmit={submitHandler}>
          {['name', 'email', 'password', 'confirmPassword'].map(
            (field) => (
              <Form.Group className="my-2" key={field}>
                <Form.Label>
                  {field === 'confirmPassword'
                    ? 'Confirm Password'
                    : field.charAt(0).toUpperCase() +
                      field.slice(1)}
                </Form.Label>

                <Form.Control
                  type={
                    field.includes('password')
                      ? 'password'
                      : field === 'email'
                      ? 'email'
                      : 'text'
                  }
                  name={field}
                  value={formData[field]}
                  placeholder={`Enter ${field}`}
                  onChange={handleChange}
                />
              </Form.Group>
            )
          )}

          <Button type="submit">Update</Button>
          {loadingUpdate && <Loader />}
        </Form>
      </Col>

      {/* RIGHT - ORDERS */}
      <Col md={9}>
        <h2>My Orders</h2>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{renderOrders()}</tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;