import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      import.meta.env.DEV ? 'http://localhost:5000' : 'http://localhost:5000'
    }/contact`,
  }),
  endpoints(builder) {
    return {
      contact: builder.query({
        query: (data) => {
          const { email, message, subject } = data
          return {
            body: {
              email,
              message,
              subject,
            },
            method: 'POST',
          }
        },
      }),
    }
  },
})

export const { useLazyContactQuery } = contactApi
export { contactApi }
