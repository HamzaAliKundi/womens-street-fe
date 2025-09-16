import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './index';

export const Provider = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      {children}
    </ReduxProvider>
  );
};
