import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from './apis/products';
import { cartApi } from './apis/cart';
import { orderApi } from './apis/order';

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productsApi.middleware)
      .concat(cartApi.middleware)
      .concat(orderApi.middleware),
});

// Store types for reference
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
