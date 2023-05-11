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
      getVideosByVideoId: builder.query({
        query: (vodIds) => {
          return {
            url: `/videos/?id=${vodIds}`,
            method: 'GET',
          }
        },
      }),
      getClipsByClipId: builder.query({
        query: (clipIds) => {
          return {
            url: `/clips/?id=${clipIds}`,
            method: 'GET',
          }
        },
      }),
      getStreamersByStreamerId: builder.query({
        query: (streamerIds) => {
          return {
            url: `/users?id=${streamerIds.map((id) => id).join('&id=')}`,
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
      getUsers: builder.query({
        query: (query) => {
          return {
            url: 'search/channels',
            params: {
              query,
            },
            method: 'GET',
          }
        },
      }),
      subscribeToEvent: builder.query({
        query: (query) => {
          // console.log(query)
          return {
            url: 'eventsub/subscriptions',
            body: query,
            headers: {
              'Client-Id': '47v1fnj00f4bpoe7nqjtbphpxs3o2x',
              Authorization: 'Bearer 5nqf65wfkjyvwv2t714ux1exf2psqc',
            },
            method: 'POST',
          }
        },
      }),
    }
  },
})

export const {
  useLazyGetUserByNameQuery,
  useLazyGetVideosByUserIdQuery,
  useLazyGetUsersQuery,
  useLazyGetVideosByVideoIdQuery,
  useLazyGetClipsByClipIdQuery,
  useLazyGetStreamersByStreamerIdQuery,
  useLazySubscribeToEventQuery,
  useGetUserByNameQuery,
  useGetVideosByVideoIdQuery,
  useGetIsStreamerOnlineQuery,
  useGetVideosByUserIdQuery,
  useGetClipsByUserIdQuery,
  useGetStreamerFollowsQuery,
  useGetUsersQuery,
} = twitchApi
export { twitchApi }
