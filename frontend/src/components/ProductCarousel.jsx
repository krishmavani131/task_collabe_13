import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

function renderCarouselItem(product) {
  return (
    <Carousel.Item key={product._id}>
      <Link to={`/product/${product._id}`}>
        <Image src={product.image} alt={product.name} fluid />
        <Carousel.Caption className='carousel-caption'>
          <h2 className='text-white text-right'>
            {product.name} (${product.price})
          </h2>
        </Carousel.Caption>
      </Link>
    </Carousel.Item>
  );
}

function ProductCarousel() {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return null;
  }

  if (error) {
    const errorMessage = error?.data?.message || error.error;
    return <Message variant='danger'>{errorMessage}</Message>;
  }

  return (
    <Carousel pause='hover' className='bg-primary mb-4'>
      {products.map((product) => renderCarouselItem(product))}
    </Carousel>
  );
}

export default ProductCarousel;