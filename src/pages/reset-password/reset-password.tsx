import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearError,
  resetPassword,
  selectUserError
} from '../../services/userSlice';

import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const error = useSelector(selectUserError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ password, token })).then((res) => {
      if (resetPassword.fulfilled.match(res)) {
        navigate('/login', { replace: true });
      }
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('resetRequested')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error ?? undefined}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
