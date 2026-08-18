import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | undefined;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: undefined
};

export const getFeeds = createAsyncThunk('feed/getFeeds', async () =>
  getFeedsApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedLoading: (state) => state.isLoading,
    selectFeedError: (state) => state.error
  }
});

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  selectFeedError
} = feedSlice.selectors;
