import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { useSelector } from '../../services/store';
import { ForgotPasswordUI } from '@ui-pages';
import {
  clearError,
  forgotPassword,
  selectUserError
} from '../../services/userSlice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const error = useSelector(selectUserError);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const res = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(res)) {
      navigate('/reset-password', { replace: true });
    }
  };

  return (
    <ForgotPasswordUI
      errorText={error ?? undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
