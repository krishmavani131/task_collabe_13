import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner, Container } from 'react-bootstrap';

const PrivateRoute = () => {
  const { userInfo, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) {
    return (
      <Container
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '70vh' }}
      >
        <div className='text-center'>
          <Spinner
            animation='border'
            variant='primary'
          />
          <p className='mt-3 text-muted'>
            Verifying account...
          </p>
        </div>
      </Container>
    );
  }

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate
      to='/login'
      replace
    />
  );
};

export default PrivateRoute;