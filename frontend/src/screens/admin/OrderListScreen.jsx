import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

import Message from '../../components/Message';
import Loader from '../../components/Loader';

import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
  const {
    data: orders,
    isLoading,
    error,
  } = useGetOrdersQuery();

  const formatDate = (date) => date?.substring(0, 10);

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
      <h1>Orders</h1>

      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orders.map(
            ({
              _id,
              user,
              createdAt,
              totalPrice,
              isPaid,
              paidAt,
              isDelivered,
              deliveredAt,
            }) => (
              <tr key={_id}>
                <td>{_id}</td>

                <td>{user?.name}</td>

                <td>{formatDate(createdAt)}</td>

                <td>${totalPrice}</td>

                <td>
                  {isPaid ? (
                    formatDate(paidAt)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>

                <td>
                  {isDelivered ? (
                    formatDate(deliveredAt)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>

                <td>
                  <Button
                    as={Link}
                    to={`/order/${_id}`}
                    variant='light'
                    className='btn-sm'
                  >
                    Details
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </>
  );
};

export default OrderListScreen;