import { Link } from 'react-router-dom';
import { Carousel, Image, Spinner, Button } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return (
      <div className='text-center py-5'>
        <Spinner animation='border' variant='primary' />
      </div>
    );
  }

  if (error) {
    return (
      <Message variant='danger'>
        {error?.data?.message || error.error}
      </Message>
    );
  }

  return (
    <Carousel
      pause='hover'
      fade
      indicators={true}
      controls={true}
      className='mb-5 shadow-lg rounded overflow-hidden'
    >
      {products?.map((product) => (
        <Carousel.Item key={product._id}>
          <Link
            to={`/product/${product._id}`}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                position: 'relative',
                height: '600px',
                overflow: 'hidden',
                borderRadius: '16px',
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fluid
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scale(1.03)',
                }}
              />

              {/* Hero Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.1) 100%)',
                }}
              />

              {/* Content Card */}
              <Carousel.Caption
                style={{
                  left: '8%',
                  right: 'auto',
                  bottom: '80px',
                  textAlign: 'left',
                  maxWidth: '550px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    padding: '30px',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <span
                    style={{
                      background: '#ffc107',
                      color: '#000',
                      padding: '8px 16px',
                      borderRadius: '50px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                    }}
                  >
                    ⭐ Top Rated Product
                  </span>

                  <h1
                    className='mt-4 mb-3 text-white'
                    style={{
                      fontWeight: '800',
                      fontSize: '3rem',
                      lineHeight: '1.1',
                    }}
                  >
                    {product.name}
                  </h1>

                  <p
                    className='text-light'
                    style={{
                      fontSize: '1.1rem',
                      opacity: 0.9,
                    }}
                  >
                    Discover premium quality, top performance,
                    and unbeatable value with this featured product.
                  </p>

                  <div className='d-flex align-items-center gap-3 flex-wrap mt-4'>
                    <h2
                      style={{
                        color: '#ffc107',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      ${product.price}
                    </h2>

                    <Button
                      variant='warning'
                      size='lg'
                      className='rounded-pill px-4 fw-bold'
                    >
                      Shop Now →
                    </Button>
                  </div>
                </div>
              </Carousel.Caption>
            </div>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;