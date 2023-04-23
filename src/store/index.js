import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import favReducer from './slices/favSlice'
import streamerReducer from './slices/streamerSlice'
import appReducer from './slices/appSlice'
import { twitchApi } from './apis/twitchApi'

export const store = configureStore({
  reducer: {
    app: appReducer,
    fav: favReducer,
    streamer: streamerReducer,
    [twitchApi.reducerPath]: twitchApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(twitchApi.middleware)
  },
})

setupListeners(store.dispatch)

export {
  useLazyGetUserByNameQuery,
  useLazyGetVideosByUserIdQuery,
  useGetUserByNameQuery,
  useGetIsStreamerOnlineQuery,
  useGetVideosByUserIdQuery,
  useGetClipsByUserIdQuery,
  useGetStreamerFollowsQuery,
} from './apis/twitchApi'

export { added, removed, removedAll } from './slices/favSlice'
export { added, removed, removedAll } from './slices/streamerSlice'
export {
  setUsername,
  setSearchedUsername,
  setUserId,
  setSearchMode,
  setErrorMsg,
  setStreamModalVideo,
  setVodModalVideo,
  setClipModalVideo,
} from './slices/appSlice'
