import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: '/products/search',
        params: { search: searchTerm },
      }),
      providesTags: ['Product'],
    }),
    getCategories: builder.query({
      query: () => '/products/categories',
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
} = productsApi;
