import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // favs: JSON.parse(localStorage.getItem('favs')) || [],
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
    addedVod(state, action) {
      state.favs.vods.push(action.payload)
    },
    removedVod(state, action) {
      state.favs.vods = state.favs.vods.filter(
        (vod) => vod.id !== action.payload
      )
    },
    removedAllVods(state) {
      state.favs.vods = []
    },
    addedClip(state, action) {
      state.favs.clips.push(action.payload)
    },
    removedClip(state, action) {
      state.favs.clips = state.favs.clips.filter(
        (clip) => clip.id !== action.payload
      )
    },
    removedAllClips(state) {
      state.favs.clips = []
    },
    addedStreamer(state, action) {
      state.favs.streamers.push(action.payload)
    },
    removedStreamer(state, action) {
      state.favs.streamers = state.favs.streamers.filter(
        (streamer) => streamer.id !== action.payload
      )
    },
    removedAllStreamers(state) {
      state.favs.streamers = []
    },
  },
})

export const {
  addedVod,
  removedVod,
  removedAllVods,
  addedClip,
  removedClip,
  removedAllClips,
  addedStreamer,
  removedStreamer,
  removedAllStreamers,
} = favSlice.actions
export default favSlice.reducer
