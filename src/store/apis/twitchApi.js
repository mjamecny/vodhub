import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const twitchApi = createApi({
  reducerPath: 'twitchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.twitch.tv/helix',
    headers: {
      'Client-Id': import.meta.env.VITE_CLIENT_ID,
      Authorization: import.meta.env.VITE_TOKEN,
    },
  }),
  endpoints(builder) {
    return {
      getUserByName: builder.query({
        query: (username) => {
          return {
            url: '/users',
            params: {
              login: username,
            },
            method: 'GET',
          }
        },
      }),
      getVideosByUserId: builder.query({
        query: (userId) => {
          return {
            url: '/videos',
            params: {
              user_id: userId,
              type: 'archive',
              first: 100,
            },
            method: 'GET',
          }
        },
      }),
      getClipsByUserId: builder.query({
        query: (userId) => {
          return {
            url: '/clips',
            params: {
              broadcaster_id: userId,
            },
            method: 'GET',
          }
        },
      }),
      getIsStreamerOnline: builder.query({
        query: (username) => {
          return {
            url: '/streams',
            params: {
              user_login: username,
            },
            method: 'GET',
          }
        },
      }),
      getStreamerFollows: builder.query({
        query: (id) => {
          return {
            url: 'users/follows',
            params: {
              to_id: id,
            },
            method: 'GET',
          }
        },
      }),
    }
  },
})

export const {
  useLazyGetUserByNameQuery,
  useLazyGetVideosByUserIdQuery,
  useGetUserByNameQuery,
  useGetIsStreamerOnlineQuery,
  useGetVideosByUserIdQuery,
  useGetClipsByUserIdQuery,
  useGetStreamerFollowsQuery,
} = twitchApi
export { twitchApi }
