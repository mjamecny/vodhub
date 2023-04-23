import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  streamers: JSON.parse(localStorage.getItem('streamers')) || [],
}

const streamerSlice = createSlice({
  name: 'streamer',
  initialState,
  reducers: {
    added(state, action) {
      state.streamers.push(action.payload)
    },
    removed(state, action) {
      state.streamers = state.streamers.filter(
        (streamer) => streamer.id !== action.payload
      )
    },
    removedAll(state) {
      state.streamers = []
    },
  },
})

export const { added, removed, removedAll } = streamerSlice.actions
export default streamerSlice.reducer
