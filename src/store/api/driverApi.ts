import { apiSlice } from './apiSlice';
import type { Driver, DriverRegisterCredentials, ApiResponse } from '@/types';

export const driverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerDriver: builder.mutation<ApiResponse<Driver>, DriverRegisterCredentials>({
      query: (credentials) => ({
        url: '/drivers/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    getAllDrivers: builder.query<ApiResponse<Driver[]>, void>({
      query: () => '/drivers',
      providesTags: ['Driver'],
    }),
    
    updateDriver: builder.mutation<ApiResponse<Driver>, { id: string; data: Partial<Driver> }>({
      query: ({ id, data }) => ({
        url: `/drivers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Driver'],
    }),
    
    getDriverProfile: builder.query<ApiResponse<Driver>, string>({
      query: (id) => `/drivers/${id}`,
      providesTags: ['Driver'],
    }),
  }),
});

export const {
  useRegisterDriverMutation,
  useGetAllDriversQuery,
  useUpdateDriverMutation,
  useGetDriverProfileQuery,
} = driverApi;