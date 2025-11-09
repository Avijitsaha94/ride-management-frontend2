import { apiSlice } from './apiSlice';
import type { 
  LoginCredentials, 
  RegisterCredentials, 
  User, 
  ApiResponse 
} from '@/types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      ApiResponse<{ user: User; token: string; refreshToken: string }>,
      LoginCredentials
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    register: builder.mutation<
      ApiResponse<{ id: string; email: string; role: string }>,
      RegisterCredentials
    >({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    refreshToken: builder.mutation<
      ApiResponse<{ token: string }>,
      { refreshToken: string }
    >({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
} = authApi;