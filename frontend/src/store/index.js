import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import appReducer from './slices/appSlice'
import userReducer from './slices/userSlice'
import { twitchApi } from './apis/twitchApi'
import { userApi } from './apis/userApi'
import { vodApi } from './apis/vodApi'
import { clipApi } from './apis/clipApi'
import { streamerApi } from './apis/streamerApi'

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    [twitchApi.reducerPath]: twitchApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [vodApi.reducerPath]: vodApi.reducer,
    [clipApi.reducerPath]: clipApi.reducer,
    [streamerApi.reducerPath]: streamerApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(twitchApi.middleware)
      .concat(userApi.middleware)
      .concat(vodApi.middleware)
      .concat(clipApi.middleware)
      .concat(streamerApi.middleware)
  },
})

setupListeners(store.dispatch)

export {
  useLazyGetUserByNameQuery,
  useLazyGetVideosByUserIdQuery,
  useLazyGetUsersQuery,
  useLazyGetVideosByVideoIdQuery,
  useLazyGetClipsByClipIdQuery,
  useLazyGetStreamersByStreamerIdQuery,
  useGetVideosByVideoIdQuery,
  useGetUserByNameQuery,
  useGetIsStreamerOnlineQuery,
  useGetVideosByUserIdQuery,
  useGetClipsByUserIdQuery,
  useGetStreamerFollowsQuery,
  useGetUsersQuery,
} from './apis/twitchApi'

export { useLazyRegisterQuery, useLazyLoginQuery } from './apis/userApi'

export {
  useAddMutation,
  useGetVodsQuery,
  useRemoveMutation,
  useRemoveAllMutation,
} from './apis/vodApi'

export {
  useAddClipMutation,
  useGetClipsQuery,
  useRemoveClipMutation,
  useRemoveAllClipsMutation,
} from './apis/clipApi'

export {
  useGetStreamersQuery,
  useAddStreamerMutation,
  useRemoveStreamerMutation,
  useRemoveAllStreamersMutation,
  useImportStreamersMutation,
} from './apis/streamerApi'

export {
  setStreamer,
  setSearchedUsername,
  setUserId,
  setSearchMode,
  setErrorMsg,
  setVods,
  setClips,
  setStreamers,
  setStreamModalVideo,
  setVodModalVideo,
  setClipModalVideo,
} from './slices/appSlice'

export { setUsername, setEmail, setPassword } from './slices/userSlice'
