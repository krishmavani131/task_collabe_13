import { Table, Button, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash, FaBoxOpen } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success('Product deleted');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
        toast.success('Product created');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <style>
        {`
          .admin-header{
            background:linear-gradient(135deg,#0f172a,#1e293b);
            border-radius:20px;
            padding:30px;
            color:white;
            margin-bottom:25px;
          }

          .admin-title{
            font-size:2rem;
            font-weight:700;
            margin:0;
          }

          .admin-subtitle{
            color:#cbd5e1;
            margin-top:5px;
          }

          .create-btn{
            border-radius:12px;
            padding:10px 18px;
            font-weight:600;
          }

          .stats-card{
            border:none;
            border-radius:18px;
            box-shadow:0 10px 30px rgba(0,0,0,.08);
            transition:.3s;
          }

          .stats-card:hover{
            transform:translateY(-5px);
          }

          .stats-icon{
            font-size:2rem;
            color:#2563eb;
          }

          .stats-number{
            font-size:1.8rem;
            font-weight:700;
          }

          .table-wrapper{
            background:white;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,.08);
          }

          .custom-table{
            margin-bottom:0;
          }

          .custom-table thead{
            background:#0f172a;
            color:white;
          }

          .custom-table th{
            border:none;
            padding:15px;
            font-weight:600;
          }

          .custom-table td{
            vertical-align:middle;
            padding:15px;
          }

          .custom-table tbody tr{
            transition:.2s;
          }

          .custom-table tbody tr:hover{
            background:#f8fafc;
          }

          .action-btn{
            border-radius:10px;
            width:38px;
            height:38px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
          }

          .pagination-wrapper{
            margin-top:25px;
            display:flex;
            justify-content:center;
          }
        `}
      </style>

      <div className="admin-header">
        <Row className="align-items-center">
          <Col>
            <h1 className="admin-title">Product Management</h1>
            <div className="admin-subtitle">
              Manage products, inventory and catalog information
            </div>
          </Col>

          <Col className="text-end">
            <Button
              className="create-btn"
              onClick={createProductHandler}
            >
              <FaPlus className="me-2" />
              Create Product
            </Button>
          </Col>
        </Row>
      </div>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Card className="stats-card">
                <Card.Body>
                  <div className="stats-icon">
                    <FaBoxOpen />
                  </div>

                  <div className="stats-number">
                    {data.products.length}
                  </div>

                  <div>Total Products</div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="stats-card">
                <Card.Body>
                  <div className="stats-icon">
                    📄
                  </div>

                  <div className="stats-number">
                    {data.page}
                  </div>

                  <div>Current Page</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="table-wrapper">
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>
                      <strong>${product.price}</strong>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>

                    <td>
                      <Button
                        as={Link}
                        to={`/admin/product/${product._id}/edit`}
                        variant="light"
                        className="action-btn me-2"
                      >
                        <FaEdit />
                      </Button>

                      <Button
                        variant="danger"
                        className="action-btn"
                        onClick={() =>
                          deleteHandler(product._id)
                        }
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="pagination-wrapper">
            <Paginate
              pages={data.pages}
              page={data.page}
              isAdmin={true}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductListScreen;

