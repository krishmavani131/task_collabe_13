import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: USERS_URL,
        method: "POST",
        body: userData,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    profile: builder.mutation({
      query: (profileData) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: profileData,
      }),
    }),

    getUsers: builder.query({
      query: () => USERS_URL,
      keepUnusedDataFor: 5,
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: (user) => ({
        url: `${USERS_URL}/${user.userId}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),

  }),
});


export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} = userApiSlice;