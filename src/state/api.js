import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: ["SuperAdmin", "Admin"],
  endpoints: (build) => ({
    signInSuperAdmin: build.query({
      query: (credentials) => ({
        url: "super-admin/sign-in",
        method: "POST",
        body: credentials,
      }),
      providesTags: ["SuperAdmin"],
    }),
    refreshTokenSuperAdmin: build.query({
      query: (refreshToken) => ({
        url: "super-admin/refresh-token",
        method: "POST",
        body: { refreshToken },
      }),
      providesTags: ["SuperAdmin"],
    }),
  }),
});

export const { useSignInSuperAdminQuery, useRefreshTokenSuperAdminQuery } = api;
