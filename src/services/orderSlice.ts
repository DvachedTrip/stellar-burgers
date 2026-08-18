import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrderByNumberApi,
  getOrdersApi
} from '../utils/burger-api';
import { TOrder } from '../utils/types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  viewedOrder: TOrder | null;
  error: string | undefined;
  isLoading: boolean;
  userOrders: TOrder[];
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  viewedOrder: null,
  error: undefined,
  isLoading: false,
  userOrders: []
};

export const getOrders = createAsyncThunk('feed/getOrders', async () =>
  getOrdersApi()
);

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => orderBurgerApi(ingredientIds)
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderModalData: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = undefined;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.viewedOrder = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectUserOrders: (state) => state.userOrders,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectViewedOrder: (state) => state.viewedOrder,
    selectOrderError: (state) => state.error
  }
});

export const { resetOrderModalData } = orderSlice.actions;
export const {
  selectOrderRequest,
  selectOrderModalData,
  selectOrderError,
  selectUserOrders,
  selectViewedOrder
} = orderSlice.selectors;
