import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const streamerApi = createApi({
  reducerPath: 'streamerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/streamers',
  }),
  tagTypes: ['Streamer'],
  endpoints(builder) {
    return {
      addStreamer: builder.mutation({
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
        invalidatesTags: ['Streamer'],
      }),
      removeStreamer: builder.mutation({
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
        invalidatesTags: ['Streamer'],
      }),
      removeAllStreamers: builder.mutation({
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
        invalidatesTags: ['Streamer'],
      }),
      getStreamers: builder.query({
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
        providesTags: ['Streamer'],
      }),
      importStreamers: builder.mutation({
        query: (data) => {
          const { streamerIds, token } = data
          return {
            url: '/import',
            body: {
              streamerIds,
            },
            headers: {
              authorization: token,
            },
            method: 'POST',
          }
        },
        invalidatesTags: ['Streamer'],
      }),
    }
  },
})

export const {
  useGetStreamersQuery,
  useAddStreamerMutation,
  useRemoveStreamerMutation,
  useRemoveAllStreamersMutation,
  useImportStreamersMutation,
} = streamerApi
export { streamerApi }
