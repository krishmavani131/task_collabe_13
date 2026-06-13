import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute() {
  const { userInfo } = useSelector((state) => state.auth);

  const isLoggedIn = Boolean(userInfo);

  if (isLoggedIn) {
    return <Outlet />;
  }

  return <Navigate to='/login' replace />;
}

export default PrivateRoute;