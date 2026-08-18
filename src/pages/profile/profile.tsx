import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, selectUser, updateUser } from '../../services/userSlice';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [fieldError, setFieldError] = useState<Record<string, string>>({});

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formValue.name.trim()) {
      errors.name = 'Нельзя оставлять поле пустым!';
    }
    if (!formValue.email.trim()) {
      errors.email = 'Нельзя оставлять поле пустым!';
    }
    if (Object.keys(errors).length > 0) {
      setFieldError(errors);
      return;
    }
    const updateData = {
      name: formValue.name,
      email: formValue.email,
      ...(formValue.password && { password: formValue.password })
    };

    dispatch(updateUser(updateData));
    setFormValue((prev) => ({ ...prev, password: '' }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFieldError({});
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      inputError={fieldError}
    />
  );
};
