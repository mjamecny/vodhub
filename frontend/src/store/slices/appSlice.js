import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  streamer: '',
  searchedUsername: '',
  userId: '',
  modalVideo: '',
  searchMode: 'vods',
  errorMsg: '',
  vods: [],
  clips: [],
  streamers: [],
  isFiltering: false,
  query: '',
  filtered: [],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setStreamer(state, action) {
      state.streamer = action.payload
    },
    setUserId(state, action) {
      state.userId = action.payload
    },
    setSearchedUsername(state, action) {
      state.searchedUsername = action.payload
    },
    setSearchMode(state, action) {
      state.searchMode = action.payload
    },
    setErrorMsg(state, action) {
      state.errorMsg = action.payload
    },
    setVods(state, action) {
      state.vods = action.payload
    },
    setClips(state, action) {
      state.clips = action.payload
    },
    setStreamers(state, action) {
      state.streamers = action.payload
    },
    setIsFiltering(state, action) {
      state.isFiltering = action.payload
    },
    setQuery(state, action) {
      state.query = action.payload
    },
    setFiltered(state, action) {
      state.filtered = action.payload
    },
    setStreamModalVideo(state, action) {
      if (process.env.NODE_ENV === 'development') {
        state.modalVideo = `https://player.twitch.tv/?channel=${action.payload}&parent=localhost`
      } else {
        state.modalVideo = `https://player.twitch.tv/?channel=${
          action.payload
        }&parent=${import.meta.env.VITE_URL}`
      }
    },
    setVodModalVideo(state, action) {
      if (process.env.NODE_ENV === 'development') {
        state.modalVideo = `https://player.twitch.tv/?video=${action.payload}&parent=localhost`
      } else {
        state.modalVideo = `https://player.twitch.tv/?video=${
          action.payload
        }&parent=${import.meta.env.VITE_URL}`
      }
    },
    setClipModalVideo(state, action) {
      if (process.env.NODE_ENV === 'development') {
        state.modalVideo = `https://clips.twitch.tv/embed?clip=${action.payload}&parent=localhost`
      } else {
        state.modalVideo = `https://clips.twitch.tv/embed?clip=${
          action.payload
        }&parent=${import.meta.env.VITE_URL}`
      }
    },
  },
})

export const {
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
  setIsFiltering,
  setQuery,
  setFiltered,
} = appSlice.actions
export default appSlice.reducer
