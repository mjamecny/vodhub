import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: '',
  email: '',
  password: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload
    },
    setEmail(state, action) {
      state.email = action.payload
    },
    setPassword(state, action) {
      state.password = action.payload
    },
  },
})

export const { setUsername, setEmail, setPassword } = userSlice.actions
export default userSlice.reducer
