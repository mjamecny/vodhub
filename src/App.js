import { BrowserRouter, Routes, Route, redirect } from 'react-router-dom'
import Home from './pages/Home'
import Error from './pages/Error'
import SharedLayout from './pages/SharedLayout'
import Favorites from './pages/Favorites'
import { useEffect, useReducer } from 'react'

const reducer = (state, action) => {
  if (action.type === 'ADD_FAV') {
    const vod = state.vods.find((vod) => vod.id === action.payload)

    const isAdded = state.favs.some((fav) => {
      return fav.id === vod.id
    })

    if (!isAdded) {
      const newFavs = [...state.favs, vod]
      return {
        ...state,
        favs: newFavs,
      }
    }

    return state
  }

  if (action.type === 'REMOVE_FAV') {
    const filteredFavs = state.favs.filter((fav) => {
      return fav.id !== action.payload
    })
    return {
      ...state,
      favs: filteredFavs,
    }
  }

  if (action.type === 'REMOVE_FILTER_FAV') {
    const filteredFavs = state.filteredFavs.filter((fav) => {
      return fav.id !== action.payload
    })
    return {
      ...state,
      filteredFavs: filteredFavs,
    }
  }

  if (action.type === 'FILTER_FAVS_TITLE') {
    const favsAfterFilter = state.favs.filter((fav) => {
      return fav.title.toLowerCase().includes(state.filterText.toLowerCase())
    })
    return {
      ...state,
      filteredFavs: favsAfterFilter,
    }
  }

  if (action.type === 'REMOVE_FAVS') {
    return {
      ...state,
      favs: action.payload,
    }
  }

  if (action.type === 'LOAD_VODS') {
    return {
      ...state,
      vods: action.payload,
    }
  }

  if (action.type === 'SET_USER') {
    return {
      ...state,
      user: action.payload,
    }
  }

  if (action.type === 'SET_USERS') {
    const isAdded = state.users.some((user) => {
      return user.login === action.payload.login
    })

    if (!isAdded) {
      return {
        ...state,
        users: [...state.users, action.payload],
      }
    } else {
      return {
        ...state,
        users: state.users,
      }
    }
  }

  if (action.type === 'REMOVE_USER') {
    const isInArr = state.favs.some((fav) => {
      return fav.user_id === action.payload
    })

    if (!isInArr) {
      const filteredUsers = state.users.filter((user) => {
        return user.id !== action.payload
      })

      return {
        ...state,
        users: filteredUsers,
      }
    }

    return {
      ...state,
      users: state.users,
    }
  }

  if (action.type === 'REMOVE_USERS') {
    return {
      ...state,
      users: action.payload,
    }
  }

  if (action.type === 'SET_STREAM') {
    return {
      ...state,
      stream: action.payload,
    }
  }

  if (action.type === 'SET_SEARCHED_STREAMER') {
    return {
      ...state,
      searchedStreamer: action.payload,
    }
  }

  if (action.type === 'DELETE_ALL_VODS') {
    return {
      ...state,
      vods: action.payload,
    }
  }

  if (action.type === 'CHANGE_USERNAME') {
    return {
      ...state,
      username: action.payload,
    }
  }

  if (action.type === 'CHANGE_FILTER_TEXT') {
    return {
      ...state,
      filterText: action.payload,
    }
  }

  if (action.type === 'SET_FILTERING') {
    return {
      ...state,
      filtering: action.payload,
    }
  }

  if (action.type === 'DELETE_FILTERED_VODS') {
    return {
      ...state,
      filteredFavs: action.payload,
    }
  }

  if (action.type === 'SET_MODE') {
    return {
      ...state,
      mode: action.payload,
    }
  }

  if (action.type === 'SET_LOADED') {
    return {
      ...state,
      loaded: action.payload,
    }
  }

  if (action.type === 'OPEN_MODAL') {
    return {
      ...state,
      videoId: action.payload,
    }
  }

  if (action.type === 'CLOSE_MODAL') {
    return {
      ...state,
      videoId: action.payload,
    }
  }

  if (action.type === 'SET_IS_LOADING') {
    return {
      ...state,
      isLoading: action.payload,
    }
  }

  if (action.type === 'SET_IS_VODS_LOADING') {
    return {
      ...state,
      isVodsLoading: action.payload,
    }
  }

  if (action.type === 'SET_ERROR_MSG') {
    return {
      ...state,
      errorMsg: action.payload,
    }
  }

  return new Error('Error - No match with action.type')
}

const defaultState = {
  user: {},
  users: [],
  isLoading: false,
  isVodsLoading: false,
  username: '',
  filterText: '',
  filtering: false,
  filteredFavs: [],
  stream: {},
  searchedStreamer: '',
  vods: [],
  favs: JSON.parse(localStorage.getItem('favs')) || [],
  mode: 'vods',
  loaded: false,
  videoId: '',
  errorMsg: '',
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState)

  const getTwitchUser = async (username, redirect) => {
    try {
      dispatch({
        type: 'SET_IS_VODS_LOADING',
        payload: true,
      })

      const res = await fetch(
        `https://api.twitch.tv/helix/users?login=${username}`,
        {
          headers: {
            'Client-Id': process.env.REACT_APP_CLIENT_ID,
            Authorization: process.env.REACT_APP_TOKEN,
          },
        }
      )

      const data = await res.json()

      if (!data || !data.data || !data.data[0]) {
        throw new Error()
      }

      getVods(data.data[0].id)
      getIsOnline(username)
    } catch (err) {
      redirect('/error')
      dispatch({
        type: 'SET_IS_VODS_LOADING',
        payload: false,
      })
      dispatch({
        type: 'SET_LOADED',
        payload: false,
      })

      dispatch({ type: 'SET_ERROR_MSG', payload: 'Streamer not found' })
    }
  }

  const getVods = async (id) => {
    try {
      const res = await fetch(
        `https://api.twitch.tv/helix/videos?user_id=${id}`,
        {
          headers: {
            'Client-Id': process.env.REACT_APP_CLIENT_ID,
            Authorization: process.env.REACT_APP_TOKEN,
          },
        }
      )

      const data = await res.json()

      if (!data || !data.data || !data.data[0]) {
        throw new Error()
      }

      dispatch({
        type: 'LOAD_VODS',
        payload: data.data,
      })

      dispatch({
        type: 'SET_IS_VODS_LOADING',
        payload: false,
      })
    } catch (err) {
      redirect('/error')
      dispatch({
        type: 'SET_IS_VODS_LOADING',
        payload: false,
      })
      dispatch({
        type: 'SET_LOADED',
        payload: false,
      })

      dispatch({ type: 'SET_ERROR_MSG', payload: 'No VODs to be seen here' })
    }
  }

  const getDetails = async (username) => {
    dispatch({
      type: 'SET_IS_LOADING',
      payload: true,
    })
    const res = await fetch(
      `https://api.twitch.tv/helix/users?login=${username}`,
      {
        headers: {
          'Client-Id': process.env.REACT_APP_CLIENT_ID,
          Authorization: process.env.REACT_APP_TOKEN,
        },
      }
    )

    const data = await res.json()

    dispatch({
      type: 'SET_USERS',
      payload: data.data[0],
    })

    dispatch({
      type: 'SET_USER',
      payload: data.data[0],
    })
    dispatch({
      type: 'SET_IS_LOADING',
      payload: false,
    })
  }

  const getIsOnline = async (username) => {
    const res = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${username}`,
      {
        headers: {
          'Client-Id': process.env.REACT_APP_CLIENT_ID,
          Authorization: process.env.REACT_APP_TOKEN,
        },
      }
    )

    const data = await res.json()

    dispatch({
      type: 'SET_STREAM',
      payload: data.data.length ? data.data[0] : {},
    })
  }

  useEffect(() => {
    localStorage.setItem('favs', JSON.stringify(state.favs))
  }, [state.favs])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SharedLayout
              state={state}
              dispatch={dispatch}
              getTwitchUser={getTwitchUser}
            />
          }
        >
          <Route index element={<Home state={state} dispatch={dispatch} />} />
          <Route
            path="/favorites"
            element={
              <Favorites
                state={state}
                dispatch={dispatch}
                getDetails={getDetails}
              />
            }
          />
          <Route path="*" element={<Error state={state} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
