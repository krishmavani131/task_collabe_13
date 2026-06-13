import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

import Message from '../../components/Message';
import Loader from '../../components/Loader';

import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';

const UserListScreen = () => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] =
    useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (!window.confirm('Are you sure')) return;

    try {
      await deleteUser(id).unwrap();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <Message variant='danger'>
        {error?.data?.message || error?.error}
      </Message>
    );
  }

  return (
    <>
      <h1>Users</h1>

      {loadingDelete && <Loader />}

      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map(
            ({ _id, name, email, isAdmin }) => (
              <tr key={_id}>
                <td>{_id}</td>

                <td>{name}</td>

                <td>
                  <a href={`mailto:${email}`}>
                    {email}
                  </a>
                </td>

                <td>
                  {isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>

                <td>
                  {!isAdmin && (
                    <>
                      <Button
                        as={Link}
                        to={`/admin/user/${_id}/edit`}
                        variant='light'
                        className='btn-sm me-2'
                      >
                        <FaEdit />
                      </Button>

                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(_id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </>
  );
};

export default UserListScreen;