import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
  Container,
} from 'react-bootstrap';
import {
  FaArrowLeft,
  FaUserEdit,
  FaUserShield,
  FaUser,
  FaEnvelope,
  FaSave,
} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] =
    useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateUser({
        userId,
        name,
        email,
        isAdmin,
      });

      toast.success('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <>
      <style>
        {`
          .edit-user-page {
            min-height: 100vh;
            padding-bottom: 30px;
          }

          .edit-user-header {
            background: linear-gradient(135deg,#0f172a,#1e293b);
            border-radius: 24px;
            padding: 35px;
            color: white;
            margin-bottom: 25px;
            box-shadow: 0 15px 40px rgba(0,0,0,.12);
          }

          .edit-user-title {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .edit-user-subtitle {
            color: #cbd5e1;
            margin: 0;
          }

          .back-btn {
            border-radius: 12px;
            font-weight: 600;
            padding: 10px 18px;
          }

          .profile-card {
            border: none;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 15px 40px rgba(0,0,0,.08);
            height: 100%;
          }

          .profile-top {
            background: linear-gradient(135deg,#2563eb,#3b82f6);
            padding: 35px;
            text-align: center;
            color: white;
          }

          .avatar {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: rgba(255,255,255,.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin: auto;
            margin-bottom: 15px;
          }

          .profile-name {
            font-size: 1.2rem;
            font-weight: 700;
          }

          .profile-email {
            opacity: .9;
            font-size: .9rem;
          }

          .profile-info {
            padding: 25px;
          }

          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eef2f7;
          }

          .form-card {
            border: none;
            border-radius: 24px;
            box-shadow: 0 15px 40px rgba(0,0,0,.08);
          }

          .form-card .card-body {
            padding: 35px;
          }

          .section-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 25px;
          }

          .form-label {
            font-weight: 600;
            color: #334155;
          }

          .form-control {
            border-radius: 12px;
            min-height: 52px;
            border: 1px solid #dbe4ee;
          }

          .form-control:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 .25rem rgba(37,99,235,.15);
          }

          .admin-switch {
            background: #f8fafc;
            border-radius: 16px;
            padding: 18px;
            border: 1px solid #e2e8f0;
          }

          .save-btn {
            border-radius: 12px;
            padding: 12px 22px;
            font-weight: 600;
            min-width: 180px;
          }

          .role-badge-admin {
            background: rgba(34,197,94,.15);
            color: #16a34a;
            border-radius: 999px;
            padding: 8px 14px;
            font-weight: 600;
          }

          .role-badge-user {
            background: rgba(239,68,68,.12);
            color: #dc2626;
            border-radius: 999px;
            padding: 8px 14px;
            font-weight: 600;
          }
        `}
      </style>

      <div className='edit-user-page'>
        <div className='edit-user-header'>
          <div className='edit-user-title'>
            <FaUserEdit className='me-3' />
            Edit User
          </div>
          <p className='edit-user-subtitle'>
            Update user profile information and permissions
          </p>
        </div>

        <Link
          to='/admin/userlist'
          className='btn btn-outline-dark back-btn mb-4'
        >
          <FaArrowLeft className='me-2' />
          Back To Users
        </Link>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Container fluid className='p-0'>
            <Row className='g-4'>
              <Col lg={4}>
                <Card className='profile-card'>
                  <div className='profile-top'>
                    <div className='avatar'>
                      {isAdmin ? <FaUserShield /> : <FaUser />}
                    </div>

                    <div className='profile-name'>
                      {name || 'User Name'}
                    </div>

                    <div className='profile-email'>
                      {email || 'user@email.com'}
                    </div>
                  </div>

                  <div className='profile-info'>
                    <div className='info-row'>
                      <span>User ID</span>
                      <small>{userId?.slice(-8)}</small>
                    </div>

                    <div className='info-row'>
                      <span>Role</span>

                      {isAdmin ? (
                        <Badge className='role-badge-admin'>
                          Admin
                        </Badge>
                      ) : (
                        <Badge className='role-badge-user'>
                          User
                        </Badge>
                      )}
                    </div>

                    <div className='info-row'>
                      <span>Status</span>
                      <Badge bg='success'>Active</Badge>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col lg={8}>
                <Card className='form-card'>
                  <Card.Body>
                    <h4 className='section-title'>
                      User Information
                    </h4>

                    <Form onSubmit={submitHandler}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className='mb-4'>
                            <Form.Label>
                              <FaUser className='me-2' />
                              Full Name
                            </Form.Label>

                            <Form.Control
                              type='text'
                              placeholder='Enter user name'
                              value={name}
                              onChange={(e) =>
                                setName(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className='mb-4'>
                            <Form.Label>
                              <FaEnvelope className='me-2' />
                              Email Address
                            </Form.Label>

                            <Form.Control
                              type='email'
                              placeholder='Enter email address'
                              value={email}
                              onChange={(e) =>
                                setEmail(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className='admin-switch mb-4'>
                        <Form.Check
                          type='switch'
                          id='admin-switch'
                          label='Grant Administrator Access'
                          checked={isAdmin}
                          onChange={(e) =>
                            setIsAdmin(e.target.checked)
                          }
                        />

                        <small className='text-muted d-block mt-2'>
                          Administrators can manage users,
                          products, orders and system settings.
                        </small>
                      </div>

                      <Button
                        type='submit'
                        variant='primary'
                        className='save-btn'
                        disabled={loadingUpdate}
                      >
                        <FaSave className='me-2' />
                        Update User
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default UserEditScreen;
