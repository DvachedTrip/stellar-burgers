import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../utils/burger-api';
import { setCookie, deleteCookie } from '../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  resetRequested: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  resetRequested: false,
  error: null
};

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response;
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    const response = await resetPasswordApi(data);
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUserError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка входа';
        state.isLoading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка регистрации';
        state.isLoading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка выхода';
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка обновления данных';
        state.isLoading = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.resetRequested = false;
        state.error = null;
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        localStorage.setItem('resetRequested', 'true');
        state.resetRequested = true;
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.resetRequested = false;
        state.error = action.error.message ?? 'Ошибка запроса сброса пароля';
        state.isLoading = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        localStorage.removeItem('resetRequested');
        state.resetRequested = false;
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка сброса пароля';
        state.isLoading = false;
      });
  }
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectUserError
} = userSlice.selectors;

export const { clearError } = userSlice.actions;
