import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  favs: JSON.parse(localStorage.getItem('favs')) || [],
}

const favSlice = createSlice({
  name: 'fav',
  initialState,
  reducers: {
    added(state, action) {
      state.favs.push(action.payload)
    },
    removed(state, action) {
      state.favs = state.favs.filter((fav) => fav.id !== action.payload)
    },
    removedAll(state) {
      state.favs = []
    },
  },
})

export const { added, removed, removedAll } = favSlice.actions
export default favSlice.reducer
