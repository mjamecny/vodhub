import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/users',
  }),
  endpoints(builder) {
    return {
      register: builder.query({
        query: (data) => {
          const { username, email, password } = data
          return {
            url: '/',
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
    }
  },
})

export const { useLazyRegisterQuery, useLazyLoginQuery } = userApi
export { userApi }
