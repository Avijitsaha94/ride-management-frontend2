import { apiSlice } from './apiSlice';
import type { Ride, ApiResponse } from '@/types';

interface RequestRideData {
  pickupLocation: string;
  dropoffLocation: string;
  paymentMethod?: 'cash' | 'card' | 'wallet';
}

interface UpdateRideStatusData {
  status: 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
}

export const rideApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User/Rider endpoints
    requestRide: builder.mutation<ApiResponse<Ride>, RequestRideData>({
      query: (data) => ({
        url: '/rides/request',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Ride'],
    }),
    
    // Driver endpoints
    acceptRide: builder.mutation<ApiResponse<Ride>, string>({
      query: (id) => ({
        url: `/rides/${id}/accept`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Ride'],
    }),
    
    updateRideStatus: builder.mutation<ApiResponse<Ride>, { id: string; data: UpdateRideStatusData }>({
      query: ({ id, data }) => ({
        url: `/rides/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Ride'],
    }),
    
    // Get all rides (Admin/Driver)
    getAllRides: builder.query<ApiResponse<Ride[]>, { status?: string; userId?: string; driverId?: string } | void>({
      query: (params) => ({
        url: '/rides',
        params: params || undefined,
      }),
      providesTags: ['Ride'],
    }),
    
    // Get ride by ID
    getRideById: builder.query<ApiResponse<Ride>, string>({
      query: (id) => `/rides/${id}`,
      providesTags: ['Ride'],
    }),
    
    // Get user's rides (for ride history)
    getUserRides: builder.query<ApiResponse<Ride[]>, string>({
      query: (userId) => `/rides?userId=${userId}`,
      providesTags: ['Ride'],
    }),
    
    // Get driver's rides
    getDriverRides: builder.query<ApiResponse<Ride[]>, string>({
      query: (driverId) => `/rides?driverId=${driverId}`,
      providesTags: ['Ride'],
    }),
  }),
});

export const {
  useRequestRideMutation,
  useAcceptRideMutation,
  useUpdateRideStatusMutation,
  useGetAllRidesQuery,
  useGetRideByIdQuery,
  useGetUserRidesQuery,
  useGetDriverRidesQuery,
} = rideApi;