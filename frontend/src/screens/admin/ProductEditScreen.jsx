import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Image } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap();

      toast.success('Product Updated Successfully');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();

      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <style>
        {`
          .edit-page {
            background: #f8fafc;
            min-height: 100vh;
            padding-bottom: 40px;
          }

          .hero-card {
            background: linear-gradient(135deg,#0f172a,#1e293b);
            border-radius: 24px;
            padding: 35px;
            color: white;
            margin-bottom: 25px;
          }

          .hero-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 6px;
          }

          .hero-subtitle {
            color: #cbd5e1;
            margin: 0;
          }

          .glass-card {
            background: rgba(255,255,255,.9);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,.5);
            box-shadow: 0 20px 40px rgba(0,0,0,.08);
            overflow: hidden;
          }

          .preview-card {
            border: none;
            border-radius: 24px;
            box-shadow: 0 15px 35px rgba(0,0,0,.08);
            overflow: hidden;
          }

          .preview-image {
            width: 100%;
            height: 420px;
            object-fit: contain;
            padding: 20px;
            background: white;
          }

          .form-section {
            padding: 30px;
          }

          .form-label {
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
          }

          .form-control {
            border-radius: 12px;
            min-height: 50px;
            border: 1px solid #dbe4ee;
          }

          .form-control:focus {
            box-shadow: 0 0 0 .25rem rgba(37,99,235,.15);
            border-color: #2563eb;
          }

          textarea.form-control {
            min-height: 120px;
          }

          .section-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 20px;
          }

          .upload-box {
            background: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 16px;
            padding: 20px;
          }

          .action-bar {
            display: flex;
            gap: 12px;
            margin-top: 25px;
          }

          .save-btn {
            border-radius: 12px;
            padding: 12px 24px;
            font-weight: 600;
          }

          .back-btn {
            border-radius: 12px;
            padding: 12px 24px;
            font-weight: 600;
          }

          .product-meta {
            padding: 15px;
            text-align: center;
            background: white;
            border-top: 1px solid #eee;
          }

          .product-name-preview {
            font-weight: 700;
            color: #0f172a;
          }

          @media (max-width: 992px) {
            .preview-image {
              height: 280px;
            }
          }
        `}
      </style>

      <div className="edit-page">
        <div className="hero-card">
          <h1 className="hero-title">Edit Product</h1>
          <p className="hero-subtitle">
            Update product details, inventory and media.
          </p>
        </div>

        <Link
          to="/admin/productlist"
          className="btn btn-outline-dark back-btn mb-4"
        >
          ← Back To Products
        </Link>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <FormContainer>
            <div className="glass-card">
              <Row className="g-0">
                <Col lg={4}>
                  <Card className="preview-card h-100">
                    <Image
                      src={image || '/images/sample.jpg'}
                      alt={name}
                      className="preview-image"
                    />

                    <div className="product-meta">
                      <div className="product-name-preview">
                        {name || 'Product Name'}
                      </div>

                      <div className="text-muted">
                        {brand || 'Brand'}
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col lg={8}>
                  <div className="form-section">
                    <h4 className="section-title">
                      Product Information
                    </h4>

                    <Form onSubmit={submitHandler}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={name}
                              placeholder="Product Name"
                              onChange={(e) =>
                                setName(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                              type="text"
                              value={brand}
                              placeholder="Brand"
                              onChange={(e) =>
                                setBrand(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                              type="number"
                              value={price}
                              placeholder="Price"
                              onChange={(e) =>
                                setPrice(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                              type="number"
                              value={countInStock}
                              placeholder="Stock Quantity"
                              onChange={(e) =>
                                setCountInStock(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                              type="text"
                              value={category}
                              placeholder="Category"
                              onChange={(e) =>
                                setCategory(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                              type="text"
                              value={image}
                              placeholder="Image URL"
                              onChange={(e) =>
                                setImage(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          value={description}
                          placeholder="Product Description"
                          onChange={(e) =>
                            setDescription(e.target.value)
                          }
                        />
                      </Form.Group>

                      <div className="upload-box mb-4">
                        <Form.Label>
                          Upload Product Image
                        </Form.Label>

                        <Form.Control
                          type="file"
                          onChange={uploadFileHandler}
                        />

                        {loadingUpload && (
                          <div className="mt-3">
                            <Loader />
                          </div>
                        )}
                      </div>

                      <div className="action-bar">
                        <Button
                          type="submit"
                          className="save-btn"
                        >
                          Update Product
                        </Button>

                        <Button
                          variant="outline-secondary"
                          className="back-btn"
                          onClick={() =>
                            navigate('/admin/productlist')
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          </FormContainer>
        )}
      </div>
    </>
  );
};

export default ProductEditScreen;

