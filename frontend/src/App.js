import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function checkSessionExpiry(dispatch) {
  const expirationTime = localStorage.getItem('expirationTime');
  if (!expirationTime) return;

  const currentTime = new Date().getTime();
  const hasExpired = currentTime > Number(expirationTime);

  if (hasExpired) {
    dispatch(logout());
  }
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    checkSessionExpiry(dispatch);
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Header />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default App;