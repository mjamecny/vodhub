import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      import.meta.env.DEV
        ? 'http://localhost:5000'
        : 'https://vodhub-api.onrender.com'
    }/api/users`,
  }),
  endpoints(builder) {
    return {
      register: builder.query({
        query: (data) => {
          const { username, email, password } = data
          return {
            body: {
              username,
              email,
              password,
            },
            method: 'POST',
          }
        },
      }),
      login: builder.query({
        query: (data) => {
          const { email, password } = data
          return {
            url: '/login',
            body: {
              email,
              password,
            },
            method: 'POST',
          }
        },
      }),
      logout: builder.query({
        query: (data) => {
          const { authToken, refreshToken } = data
          return {
            url: '/logout',
            body: {
              token: refreshToken,
            },
            headers: {
              authorization: authToken,
            },
            method: 'DELETE',
          }
        },
      }),
      forgotPassword: builder.query({
        query: (data) => {
          const { email } = data
          return {
            url: '/forgotPassword',
            body: {
              email,
            },
            method: 'POST',
          }
        },
      }),

      resetPassword: builder.query({
        query: (data) => {
          const { password, token } = data
          return {
            url: `/resetPassword/${token}`,
            body: {
              password,
            },
            method: 'PATCH',
          }
        },
      }),
    }
  },
})

export const {
  useLazyRegisterQuery,
  useLazyLoginQuery,
  useLazyForgotPasswordQuery,
  useLazyResetPasswordQuery,
  useLazyLogoutQuery,
} = userApi
export { userApi }
