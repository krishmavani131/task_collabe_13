import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { userInfo } = useSelector(
    (state) => state.auth
  );

  if (!userInfo) {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  return userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate
      to='/unauthorized'
      replace
    />
  );
};

export default AdminRoute;