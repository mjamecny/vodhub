import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  favs: {
    vods: JSON.parse(localStorage.getItem('vods')) || [],
    clips: JSON.parse(localStorage.getItem('clips')) || [],
    streamers: JSON.parse(localStorage.getItem('streamers')) || [],
  },
}

const favSlice = createSlice({
  name: 'fav',
  initialState,
  reducers: {
    added(state, action) {
      if (action.payload.isVod) state.favs.vods.push(action.payload)
      if (action.payload.isClip) state.favs.clips.push(action.payload)
      if (action.payload.isStreamer) state.favs.streamers.push(action.payload)
    },
    removed(state, action) {
      console.log(action.payload)
      if (action.payload.isVod) {
        state.favs.vods = state.favs.vods.filter(
          (vod) => vod.id !== action.payload.id
        )
      }
      if (action.payload.isClip) {
        state.favs.clips = state.favs.clips.filter(
          (clip) => clip.id !== action.payload.id
        )
      }
      if (action.payload.isStreamer) {
        state.favs.streamers = state.favs.streamers.filter(
          (streamer) => streamer.id !== action.payload.id
        )
      }
    },
    removedAll(state, action) {
      if (action.payload === 'vods') state.favs.vods = []
      if (action.payload === 'clips') state.favs.clips = []
      if (action.payload === 'streamers') state.favs.streamers = []
    },
    importData(state, action) {
      state.favs.streamers = []
      state.favs.streamers = action.payload
    },
  },
})

export const { added, removed, removedAll, importData } = favSlice.actions
export default favSlice.reducer
