import { Navigate } from 'react-router-dom';

const ProtectedRouter = ({ children }) => {
  if (!user) {
    return <Navigate to='/login' />;
  } else {
    return children;
  }
};
