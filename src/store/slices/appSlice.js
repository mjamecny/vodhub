import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: '',
  searchedUsername: '',
  userId: '',
  modalVideo: '',
  searchMode: 'vods',
  errorMsg: '',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload
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
  setUsername,
  setSearchedUsername,
  setUserId,
  setSearchMode,
  setErrorMsg,
  setStreamModalVideo,
  setVodModalVideo,
  setClipModalVideo,
} = appSlice.actions
export default appSlice.reducer
