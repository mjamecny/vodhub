import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const vodApi = createApi({
  reducerPath: 'vodApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      import.meta.env.DEV
        ? 'http://localhost:5000'
        : 'https://vodhub-api.onrender.com'
    }/api/vods`,
  }),
  tagTypes: ['VOD'],
  endpoints(builder) {
    return {
      add: builder.mutation({
        query: (data) => {
          const { id, token } = data
          return {
            url: '/',
            body: {
              id,
            },
            headers: {
              authorization: token,
            },
            method: 'POST',
          }
        },
        invalidatesTags: ['VOD'],
      }),
      remove: builder.mutation({
        query: (data) => {
          const { id, token } = data
          return {
            url: `/${id}`,
            headers: {
              authorization: token,
            },
            method: 'DELETE',
          }
        },
        invalidatesTags: ['VOD'],
      }),
      removeAll: builder.mutation({
        query: (data) => {
          const { token } = data
          return {
            url: `/`,
            headers: {
              authorization: token,
            },
            method: 'DELETE',
          }
        },
        invalidatesTags: ['VOD'],
      }),
      getVods: builder.query({
        query: (data) => {
          const { token } = data
          return {
            url: '/',
            headers: {
              authorization: token,
            },
            method: 'GET',
          }
        },
        providesTags: ['VOD'],
      }),
    }
  },
})

export const {
  useAddMutation,
  useGetVodsQuery,
  useRemoveMutation,
  useRemoveAllMutation,
} = vodApi
export { vodApi }
