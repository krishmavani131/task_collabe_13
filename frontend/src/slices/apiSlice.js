import {
  fetchBaseQuery,
  createApi,
} from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '../constants';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
});

const baseQueryWithAuth = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(
    args,
    api,
    extraOptions
  );

  if (
    result?.error?.status === 401
  ) {
    console.warn(
      'Session expired. Logging out user.'
    );

    api.dispatch(logout());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: baseQueryWithAuth,

  tagTypes: [
    'Product',
    'Order',
    'User',
  ],

  endpoints: () => ({}),
});