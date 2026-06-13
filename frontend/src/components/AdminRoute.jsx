import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminRoute() {
  const { userInfo } = useSelector((state) => state.auth);

  const isAdmin = Boolean(userInfo && userInfo.isAdmin);

  if (isAdmin) {
    return <Outlet />;
  }

  return <Navigate to='/login' replace />;
}

export default AdminRoute;