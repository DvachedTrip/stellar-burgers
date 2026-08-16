import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectUserOrders, getOrders } from '../../services/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectUserOrders);

  return <ProfileOrdersUI orders={orders} />;
};
