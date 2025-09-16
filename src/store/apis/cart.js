import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART}`,
    timeout: API_CONFIG.TIMEOUT
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    // Get cart by guest ID
    getCart: builder.query({
      query: (guestId) => `/${guestId}`,
      providesTags: ['Cart'],
    }),
    
    // Add item to cart
    addToCart: builder.mutation({
      query: ({ guestId, productId, quantity = 1 }) => ({
        url: `/${guestId}/add`,
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    
    // Update cart item quantity
    updateCartItem: builder.mutation({
      query: ({ guestId, productId, quantity }) => ({
        url: `/${guestId}/item/${productId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    
    // Remove item from cart
    removeFromCart: builder.mutation({
      query: ({ guestId, productId }) => ({
        url: `/${guestId}/item/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    // Clear entire cart
    clearCart: builder.mutation({
      query: (guestId) => ({
        url: `/${guestId}/clear`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
