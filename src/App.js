import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Form from './components/Form'
import Button from './components/Button'
import { useEffect, useReducer } from 'react'
import {
  FaCheck,
  FaRegTrashAlt,
  FaRegClock,
  FaRegCalendarAlt,
} from 'react-icons/fa'

const reducer = (state, action) => {
  console.log(state, action)

  if (action.type === 'ADD_FAV') {
    console.log(action.payload)
    const vod = state.vods.find((vod) => vod.id === action.payload)

    const isAdded = state.favs.some((fav) => {
      return fav.id === vod.id
    })

    if (!isAdded) {
      // showAlert()
      const newFavs = [...state.favs, vod]
      return {
        ...state,
        favs: newFavs,
        showNotification: true,
        notificationContent: 'VOD was added',
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

  if (action.type === 'DELETE_ALL') {
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

  if (action.type === 'SET_MODE') {
    return {
      ...state,
      mode: action.payload,
    }
  }

  if (action.type === 'CLOSE_NOTIF') {
    return {
      ...state,
      showNotification: false,
    }
  }

  return new Error('Error - No match with action.type')
}

const defaultState = {
  username: '',
  vods: [],
  favs: JSON.parse(localStorage.getItem('favs')) || [],
  mode: 'vods',
  showNotification: false,
  notificationContent: '',
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState)

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Slash') {
      e.preventDefault()
      const input = document.querySelector('.form__username')
      input.focus()
    }
  })

  const getTwitchUser = async (username) => {
    showSpinner()
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
    getVods(data.data[0].id)
  }

  const getVods = async (id) => {
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

    dispatch({
      type: 'LOAD_VODS',
      payload: data.data,
    })

    removeSpinner()
  }

  function showSpinner() {
    document.querySelector('.spinner').classList.add('show')
  }

  function showAlert() {
    const alertEl = document.querySelector('.alert')
    alertEl.classList.add('show')

    setTimeout(() => {
      alertEl.classList.remove('show')
    }, 2000)
  }

  function removeSpinner() {
    document.querySelector('.spinner').classList.remove('show')
  }

  const formSubmit = (e) => {
    e.preventDefault()

    dispatch({
      type: 'DELETE_ALL_VODS',
      payload: [],
    })

    dispatch({
      type: 'SET_MODE',
      payload: 'vods',
    })

    if (state.username) {
      getTwitchUser(state.username)
    } else {
      alert('Please fill the form')
    }

    // dispatch({ type: 'CHANGE_USERNAME', payload: '' })
  }

  useEffect(() => {
    localStorage.setItem('favs', JSON.stringify(state.favs))
  }, [state.favs])

  return (
    <div className="container">
      <Form state={state} dispatch={dispatch} formSubmit={formSubmit} />

      <Button dispatch={dispatch} state={state} />

      <div className="vods">
        {state.mode === 'vods'
          ? state.vods.map((vod) => {
              const { id, thumbnail_url, url, title, published_at, duration } =
                vod

              const final_src = thumbnail_url.replace(
                /%{width}x%{height}/g,
                '1280x720'
              )

              const date = new Date(published_at)

              const [month, day, year] = [
                date.getMonth(),
                date.getDate(),
                date.getFullYear(),
              ]

              return (
                <div className="one-vod" key={id}>
                  <img className="image" src={final_src} alt="thumbnail" />
                  <div className="box">
                    <h2 className="title">
                      <a className="link" href={url}>
                        {title}
                      </a>
                    </h2>
                    <div className="text-box">
                      <p className="date">
                        <FaRegCalendarAlt className="icon" />
                        <span>{`${day}/${month + 1}/${year}`}</span>
                      </p>
                      <FaCheck
                        className="icon-fav"
                        data-id={id}
                        onClick={(e) =>
                          dispatch({
                            type: 'ADD_FAV',
                            payload: e.currentTarget.dataset.id,
                          })
                        }
                      />
                      <p className="duration">
                        <FaRegClock className="icon" />
                        <span>{duration}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          : state.favs.map((fav) => {
              const { id, thumbnail_url, url, title, published_at, duration } =
                fav

              const final_src = thumbnail_url.replace(
                /%{width}x%{height}/g,
                '1280x720'
              )

              const date = new Date(published_at)

              const [month, day, year] = [
                date.getMonth(),
                date.getDate(),
                date.getFullYear(),
              ]

              return (
                <div className="one-vod" key={id}>
                  <img className="image" src={final_src} alt="thumbnail" />
                  <div className="box">
                    <h2 className="title">
                      <a className="link" href={url}>
                        {title}
                      </a>
                    </h2>
                    <div className="text-box">
                      <p className="date">
                        <FaRegCalendarAlt className="icon" />
                        <span>{`${day}/${month + 1}/${year}`}</span>
                      </p>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'REMOVE_FAV',
                            payload: id,
                          })
                        }
                        className="del-btn"
                        data-id={id}
                      >
                        <FaRegTrashAlt className="icon-fav" />
                      </button>

                      <p className="duration">
                        <FaRegClock className="icon" />
                        <span>{duration}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}

export default App
