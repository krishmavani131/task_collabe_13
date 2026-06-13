import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { logout } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const baseQueryHandler = async (request, api, extraOptions) => {
  const response = await baseQuery(request, api, extraOptions);

  if (response?.error?.status === 401) {
    api.dispatch(logout());
  }

  return response;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryHandler,
  tagTypes: ["Product", "Order", "User"],
  endpoints: () => ({}),
});