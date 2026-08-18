import { Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/userSlice';
import { Preloader } from '../ui/preloader';
import { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRouter = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
