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

export const convertDurationToMin = (duration) => {
  const currentTime = new Date()
  const startedAt = new Date(duration)
  const durationMs = currentTime.getTime() - startedAt.getTime()
  return durationMs / 60000
}
