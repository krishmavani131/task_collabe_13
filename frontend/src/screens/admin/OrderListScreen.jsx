import { Table, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import {
  FaTimes,
  FaCheck,
  FaBoxOpen,
  FaMoneyBillWave,
  FaTruck,
  FaEye,
} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const totalOrders = orders?.length || 0;
  const paidOrders =
    orders?.filter((order) => order.isPaid).length || 0;
  const deliveredOrders =
    orders?.filter((order) => order.isDelivered).length || 0;

  return (
    <>
      <style>
        {`
          .orders-page {
            padding-bottom: 30px;
          }

          .orders-header {
            background: linear-gradient(135deg,#0f172a,#1e293b);
            border-radius: 24px;
            padding: 35px;
            color: white;
            margin-bottom: 25px;
            box-shadow: 0 15px 40px rgba(0,0,0,.12);
          }

          .orders-title {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .orders-subtitle {
            color: #cbd5e1;
            margin: 0;
          }

          .stats-card {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(0,0,0,.08);
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

          .orders-table-card {
            border: none;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 15px 40px rgba(0,0,0,.08);
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
            font-size: .85rem;
            font-weight: 600;
            letter-spacing: .5px;
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

          .order-id {
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #64748b;
            font-size: .85rem;
          }

          .user-name {
            font-weight: 600;
            color: #0f172a;
          }

          .price {
            font-weight: 700;
            color: #2563eb;
          }

          .status-paid {
            background: rgba(34,197,94,.12);
            color: #16a34a;
            border-radius: 999px;
            padding: 8px 14px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .status-unpaid {
            background: rgba(239,68,68,.12);
            color: #dc2626;
            border-radius: 999px;
            padding: 8px 14px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .details-btn {
            border-radius: 12px;
            font-weight: 600;
            padding: 8px 16px;
          }
        `}
      </style>

      <div className='orders-page'>
        {/* Header */}
        <div className='orders-header'>
          <h1 className='orders-title'>Order Management</h1>
          <p className='orders-subtitle'>
            Monitor customer orders, payments and deliveries.
          </p>
        </div>

        {/* Statistics */}
        {!isLoading && orders && (
          <Row className='g-4 mb-4'>
            <Col md={4}>
              <Card className='stats-card'>
                <Card.Body>
                  <FaBoxOpen
                    className='stats-icon'
                    style={{ color: '#2563eb' }}
                  />
                  <div className='stats-number'>{totalOrders}</div>
                  <div className='stats-label'>Total Orders</div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className='stats-card'>
                <Card.Body>
                  <FaMoneyBillWave
                    className='stats-icon'
                    style={{ color: '#16a34a' }}
                  />
                  <div className='stats-number'>{paidOrders}</div>
                  <div className='stats-label'>Paid Orders</div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className='stats-card'>
                <Card.Body>
                  <FaTruck
                    className='stats-icon'
                    style={{ color: '#f59e0b' }}
                  />
                  <div className='stats-number'>
                    {deliveredOrders}
                  </div>
                  <div className='stats-label'>
                    Delivered Orders
                  </div>
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
          <Card className='orders-table-card'>
            <Table responsive hover className='custom-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CUSTOMER</th>
                  <th>ORDER DATE</th>
                  <th>TOTAL</th>
                  <th>PAYMENT</th>
                  <th>DELIVERY</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className='order-id'>{order._id}</td>

                    <td>
                      <div className='user-name'>
                        {order.user && order.user.name}
                      </div>
                    </td>

                    <td>
                      {order.createdAt.substring(0, 10)}
                    </td>

                    <td className='price'>
                      ${order.totalPrice}
                    </td>

                    <td>
                      {order.isPaid ? (
                        <Badge className='status-paid'>
                          <FaCheck />
                          {order.paidAt.substring(0, 10)}
                        </Badge>
                      ) : (
                        <Badge className='status-unpaid'>
                          <FaTimes />
                          Unpaid
                        </Badge>
                      )}
                    </td>

                    <td>
                      {order.isDelivered ? (
                        <Badge className='status-paid'>
                          <FaCheck />
                          {order.deliveredAt.substring(0, 10)}
                        </Badge>
                      ) : (
                        <Badge className='status-unpaid'>
                          <FaTimes />
                          Pending
                        </Badge>
                      )}
                    </td>

                    <td>
                      <Button
                        as={Link}
                        to={`/order/${order._id}`}
                        variant='dark'
                        className='details-btn'
                      >
                        <FaEye className='me-2' />
                        Details
                      </Button>
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

export default OrderListScreen;
