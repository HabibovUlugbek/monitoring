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

const createQueryString = ({ startDate, endDate, region }) => {
  const queryParams = {
    startDate,
    endDate,
    region,
  };

  Object.keys(queryParams).forEach((key) => {
    if (!queryParams[key]) {
      delete queryParams[key];
    }
  });

  const queryString = new URLSearchParams(queryParams).toString();
  return queryString;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "adminApi",
  tagTypes: ["Admin", "Notification", "Loan"],
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
    getAdminStats: build.query({
      query: (query) => ({
        url: `admin/stats?${createQueryString(query)}`,
      }),
      providesTags: ["Admin"],
    }),
    getMe: build.query({
      query: () => "admin/me",
      providesTags: ["Admin"],
    }),
    getNotifications: build.query({
      query: () => "notifications",
      providesTags: ["Notification"],
    }),
    markAsReadNotification: build.mutation({
      query: (id) => ({
        url: `notifications/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    getLoans: build.query({
      query: () => "loan",
      providesTags: ["Loan"],
    }),
    getLoan: build.query({
      query: (id) => `loan/${id}`,
      providesTags: ["Loan"],
    }),
    assignLoan: build.mutation({
      query: (data) => ({
        url: "loan/assign",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Loan"],
    }),
    approveLoan: build.mutation({
      query: (id) => ({
        url: `loan/approve/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Loan"],
    }),
    rejectLoan: build.mutation({
      query: (id) => ({
        url: `loan/reject/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Loan"],
    }),
    getLoanStats: build.query({
      query: () => ({
        url: `loan/stats`,
        method: "POST",
      }),
      providesTags: ["Loan"],
    }),
    sendMessage: build.mutation({
      query: (body) => ({
        url: "loan/send/message",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notification"],
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
  useGetNotificationsQuery,
  useMarkAsReadNotificationMutation,
  useGetLoansQuery,
  useGetLoanQuery,
  useAssignLoanMutation,
  useGetAdminStatsQuery,
  useApproveLoanMutation,
  useRejectLoanMutation,
  useGetLoanStatsQuery,
  useSendMessageMutation,
} = api;
