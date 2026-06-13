import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';

import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery({ pageNumber });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const deleteHandler = async (id) => {
    if (!window.confirm('Are you sure')) return;

    try {
      await deleteProduct(id).unwrap();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const createProductHandler = async () => {
    if (!window.confirm('Are you sure you want to create a new product?'))
      return;

    try {
      await createProduct().unwrap();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;

  if (error)
    return (
      <Message variant='danger'>
        {error?.data?.message || 'Something went wrong'}
      </Message>
    );

  const { products, pages, page } = data;

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>

        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>

      {(loadingCreate || loadingDelete) && <Loader />}

      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {products.map(
            ({ _id, name, price, category, brand }) => (
              <tr key={_id}>
                <td>{_id}</td>
                <td>{name}</td>
                <td>${price}</td>
                <td>{category}</td>
                <td>{brand}</td>

                <td>
                  <Button
                    as={Link}
                    to={`/admin/product/${_id}/edit`}
                    variant='light'
                    className='btn-sm mx-2'
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
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>

      <Paginate pages={pages} page={page} isAdmin />
    </>
  );
};

export default ProductListScreen;