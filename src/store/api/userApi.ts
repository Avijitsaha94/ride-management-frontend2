import { apiSlice } from './apiSlice';
import type { User, ApiResponse } from '@/types';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => '/users/all-users',
      providesTags: ['User'],
    }),
    
    updateUser: builder.mutation<ApiResponse<User>, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    getUserProfile: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useGetUserProfileQuery,
} = userApi;