import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie, setCookie } from "helper";

const getAccessTokenFromCookie = () => getCookie("super-accessToken");
const getRefreshTokenFromCookie = () => getCookie("super-refreshToken");

const handle401Error = async (args, api, extraOptions, baseQuery) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(1234, result);
  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshTokenFromCookie();
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "super-admin/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );
      if (refreshResult.data) {
        setCookie("super-accessToken", refreshResult.data.accessToken);
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
    baseUrl: "http://localhost:4000/api/v1",
    prepareHeaders: (headers) => {
      const accessToken = getAccessTokenFromCookie();
      console.log(123, accessToken);
      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

  return handle401Error(args, api, extraOptions, baseQuery);
};

export const superapi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "superAdminApi",
  tagTypes: ["SuperAdmin"],
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
    getAdminsForSuperAdmin: build.query({
      query: () => "super-admin/admins",
      providesTags: ["SuperAdmin"],
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
  }),
});

export const {
  useSignInSuperAdminQuery,
  useRefreshTokenSuperAdminQuery,
  useGetAdminsForSuperAdminQuery,
  useDeleteAdminMutation,
  useCreateAdminMutation,
  useUpdateAdminMutation,
} = superapi;
