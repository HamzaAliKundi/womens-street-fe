import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDER}`,
    timeout: API_CONFIG.TIMEOUT
  }),
  tagTypes: ['Order', 'Cart'],
  endpoints: (builder) => ({
    // Create order
    createOrder: builder.mutation({
      query: ({ guestId, customerDetails }) => ({
        url: `/${guestId}/create`,
        method: 'POST',
        body: { customerDetails },
      }),
      invalidatesTags: ['Order', 'Cart'], // This will refresh both order and cart data
    }),
    
    // Get orders by guest ID
    getOrdersByGuest: builder.query({
      query: ({ guestId, page = 1, limit = 10 }) => ({
        url: `/${guestId}/orders`,
        params: { page, limit },
      }),
      providesTags: ['Order'],
    }),
    
    // Get single order by ID
    getOrder: builder.query({
      query: (orderId) => `/single/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),
    
    // Get order by order number
    getOrderByNumber: builder.query({
      query: (orderNumber) => `/number/${orderNumber}`,
      providesTags: (result, error, orderNumber) => [{ type: 'Order', id: orderNumber }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersByGuestQuery,
  useGetOrderQuery,
  useGetOrderByNumberQuery,
} = orderApi;
