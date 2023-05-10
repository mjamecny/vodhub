import axios from 'axios'
import { createRefresh } from 'react-auth-kit'

export const changeImageSize = (url, size) => {
  return url.replace(/%{width}x%{height}/g, size)
}

export const changeDateFormat = (date) => {
  const newDate = new Date(date)
  return [newDate.getMonth(), newDate.getDate(), newDate.getFullYear()]
}

export const changeNumberFormat = (number) => {
  return number.toLocaleString('en-US').replace(/,/g, ' ')
}

export const convertDuration = (duration) => {
  const currentTime = new Date()
  const startedAt = new Date(duration)
  const durationMs = currentTime.getTime() - startedAt.getTime()
  // return durationMs / 60000

  // Convert milliseconds to seconds
  const durationSeconds = Math.floor(durationMs / 1000)

  // Calculate the hours, minutes, and seconds
  const hours = Math.floor(durationSeconds / 3600)
  const minutes = Math.floor((durationSeconds % 3600) / 60)
  const seconds = durationSeconds % 60

  const formattedDuration = `${hours.toString().padStart(2, '0')}h${minutes
    .toString()
    .padStart(2, '0')}m${seconds.toString().padStart(2, '0')}s`

  return formattedDuration
}

export const refreshApi = createRefresh({
  interval: 10, // Refreshs the token in every 10 minutes
  refreshApiCallback: async ({
    authToken,
    authTokenExpireAt,
    refreshToken,
    refreshTokenExpiresAt,
    authUserState,
  }) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.DEV
            ? 'http://localhost:5000'
            : 'https://vodhub-api.onrender.com'
        }/api/users/token`,
        { refreshToken },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      )
      return {
        isSuccess: true,
        newAuthToken: res.data.token,
      }
    } catch (error) {
      console.error(error)
      return {
        isSuccess: false,
      }
    }
  },
})
