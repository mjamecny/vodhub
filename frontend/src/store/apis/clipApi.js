import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const clipApi = createApi({
  reducerPath: 'clipApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/clips',
  }),
  tagTypes: ['Clip'],
  endpoints(builder) {
    return {
      addClip: builder.mutation({
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
        invalidatesTags: ['Clip'],
      }),
      removeClip: builder.mutation({
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
        invalidatesTags: ['Clip'],
      }),
      removeAllClips: builder.mutation({
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
        invalidatesTags: ['Clip'],
      }),
      getClips: builder.query({
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
        providesTags: ['Clip'],
      }),
    }
  },
})

export const {
  useAddClipMutation,
  useGetClipsQuery,
  useRemoveClipMutation,
  useRemoveAllClipsMutation,
} = clipApi
export { clipApi }
