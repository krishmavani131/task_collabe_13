import React from 'react';
import { Table, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaUsers,
  FaUserShield,
  FaUser,
} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        refetch();
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const totalUsers = users?.length || 0;
  const adminUsers = users?.filter((user) => user.isAdmin).length || 0;
  const normalUsers = totalUsers - adminUsers;

  return (
    <>
      <style>
        {`
          .user-page {
            padding-bottom: 30px;
          }

          .user-header {
            background: linear-gradient(135deg, #0f172a, #1e293b);
            border-radius: 24px;
            padding: 32px;
            margin-bottom: 25px;
            color: white;
            box-shadow: 0 15px 40px rgba(0,0,0,0.12);
          }

          .user-header h1 {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 6px;
          }

          .user-header p {
            margin: 0;
            color: #cbd5e1;
          }

          .stats-card {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,.08);
            transition: all .3s ease;
            height: 100%;
          }

          .stats-card:hover {
            transform: translateY(-5px);
          }

          .stats-card .card-body {
            padding: 24px;
          }

          .stats-icon {
            font-size: 2rem;
            margin-bottom: 12px;
            color: #2563eb;
          }

          .stats-number {
            font-size: 2rem;
            font-weight: 700;
            color: #0f172a;
          }

          .stats-label {
            color: #64748b;
            font-weight: 500;
          }

          .table-card {
            border: none;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 35px rgba(0,0,0,.08);
          }

          .custom-table {
            margin-bottom: 0;
          }

          .custom-table thead {
            background: #0f172a;
            color: white;
          }

          .custom-table thead th {
            border: none;
            padding: 18px;
            font-size: 0.85rem;
            letter-spacing: .5px;
            font-weight: 600;
          }

          .custom-table td {
            vertical-align: middle;
            padding: 16px 18px;
          }

          .custom-table tbody tr {
            transition: all .2s ease;
          }

          .custom-table tbody tr:hover {
            background: #f8fafc;
          }

          .user-name {
            font-weight: 600;
            color: #0f172a;
          }

          .user-email {
            color: #475569;
            text-decoration: none;
          }

          .user-email:hover {
            color: #2563eb;
          }

          .admin-badge {
            background: rgba(34,197,94,.12);
            color: #15803d;
            border-radius: 999px;
            padding: 8px 14px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .user-badge {
            background: rgba(239,68,68,.10);
            color: #dc2626;
            border-radius: 999px;
            padding: 8px 14px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .action-btn {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            transition: all .2s ease;
          }

          .edit-btn:hover {
            transform: translateY(-2px);
          }

          .delete-btn:hover {
            transform: translateY(-2px);
          }

          .id-cell {
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #64748b;
            font-size: 0.85rem;
          }
        `}
      </style>

      <div className='user-page'>
        {/* Header */}
        <div className='user-header'>
          <h1>User Management</h1>
          <p>Manage platform users, permissions and administration.</p>
        </div>

        {/* Statistics */}
        {!isLoading && users && (
          <Row className='g-4 mb-4'>
            <Col md={4}>
              <Card className='stats-card'>
                <Card.Body>
                  <FaUsers className='stats-icon' />
                  <div className='stats-number'>{totalUsers}</div>
                  <div className='stats-label'>Total Users</div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className='stats-card'>
                <Card.Body>
                  <FaUserShield className='stats-icon' />
                  <div className='stats-number'>{adminUsers}</div>
                  <div className='stats-label'>Administrators</div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className='stats-card'>
                <Card.Body>
                  <FaUser className='stats-icon' />
                  <div className='stats-number'>{normalUsers}</div>
                  <div className='stats-label'>Regular Users</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Card className='table-card'>
            <Table responsive hover className='custom-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className='id-cell'>{user._id}</td>

                    <td>
                      <div className='user-name'>{user.name}</div>
                    </td>

                    <td>
                      <a
                        href={`mailto:${user.email}`}
                        className='user-email'
                      >
                        {user.email}
                      </a>
                    </td>

                    <td>
                      {user.isAdmin ? (
                        <span className='admin-badge'>
                          <FaCheck />
                          Admin
                        </span>
                      ) : (
                        <span className='user-badge'>
                          <FaTimes />
                          User
                        </span>
                      )}
                    </td>

                    <td>
                      {!user.isAdmin && (
                        <>
                          <Button
                            as={Link}
                            to={`/admin/user/${user._id}/edit`}
                            variant='light'
                            className='action-btn edit-btn me-2'
                          >
                            <FaEdit />
                          </Button>

                          <Button
                            variant='danger'
                            className='action-btn delete-btn'
                            onClick={() => deleteHandler(user._id)}
                          >
                            <FaTrash />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </div>
    </>
  );
};

export default UserListScreen;
