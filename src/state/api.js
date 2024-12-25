import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie, setCookie } from "helper";

const getAccessTokenFromCookie = () => getCookie("accessToken");
const getRefreshTokenFromCookie = () => getCookie("refreshToken");

const handle401Error = async (args, api, extraOptions, baseQuery) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshTokenFromCookie();
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "admin/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );
      if (refreshResult.data) {
        setCookie("accessToken", refreshResult.data.accessToken);
        result = await baseQuery(args, api, extraOptions);
      } else {
        throw new Error("Failed to refresh token");
      }
    }
  }
  return result;
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      const accessToken = getAccessTokenFromCookie();
      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

  return handle401Error(args, api, extraOptions, baseQuery);
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "adminApi",
  tagTypes: ["Admin"],
  endpoints: (build) => ({
    signInAdmin: build.query({
      query: (credentials) => ({
        url: "admin/sign-in",
        method: "POST",
        body: credentials,
      }),
      providesTags: ["Admin"],
    }),
    refreshTokenAdmin: build.query({
      query: (refreshToken) => ({
        url: "admin/refresh-token",
        method: "POST",
        body: { refreshToken },
      }),
      providesTags: ["Admin"],
    }),
    deleteAdmin: build.mutation({
      query: (id) => ({
        url: `admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    createAdmin: build.mutation({
      query: (admin) => ({
        url: "admin",
        method: "POST",
        body: admin,
      }),
      invalidatesTags: ["Admin"],
    }),
    updateAdmin: build.mutation({
      query: (admin) => ({
        url: `admin/${admin.id}`,
        method: "PATCH",
        body: admin,
      }),
      invalidatesTags: ["Admin"],
    }),
    getAdmins: build.query({
      query: () => "admin",
      providesTags: ["Admin"],
    }),
    getMe: build.query({
      query: () => "admin/me",
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useSignInAdminQuery,
  useRefreshTokenAdminQuery,
  useDeleteAdminMutation,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useGetAdminsQuery,
  useGetMeQuery,
} = api;
