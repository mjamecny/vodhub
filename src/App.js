import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Error from "./pages/Error"
import SharedLayout from "./pages/SharedLayout"
import Favorites from "./pages/Favorites"
import { useEffect, useReducer } from "react"

const reducer = (state, action) => {
  if (action.type === "ADD_FAV") {
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

  if (action.type === "REMOVE_FAV") {
    const filteredFavs = state.favs.filter((fav) => {
      return fav.id !== action.payload
    })
    return {
      ...state,
      favs: filteredFavs,
    }
  }

  if (action.type === "REMOVE_FILTER_FAV") {
    const filteredFavs = state.filteredFavs.filter((fav) => {
      return fav.id !== action.payload
    })
    return {
      ...state,
      filteredFavs: filteredFavs,
    }
  }

  if (action.type === "FILTER_FAVS_TITLE") {
    const favsAfterFilter = state.favs.filter((fav) => {
      return fav.title.toLowerCase().includes(state.filterText.toLowerCase())
    })
    return {
      ...state,
      filteredFavs: favsAfterFilter,
    }
  }

  if (action.type === "DELETE_ALL") {
    return {
      ...state,
      favs: action.payload,
    }
  }

  if (action.type === "LOAD_VODS") {
    return {
      ...state,
      vods: action.payload,
    }
  }

  if (action.type === "DELETE_ALL_VODS") {
    return {
      ...state,
      vods: action.payload,
    }
  }

  if (action.type === "CHANGE_USERNAME") {
    return {
      ...state,
      username: action.payload,
    }
  }

  if (action.type === "CHANGE_FILTER_TEXT") {
    return {
      ...state,
      filterText: action.payload,
    }
  }
  if (action.type === "SET_FILTERING") {
    return {
      ...state,
      filtering: action.payload,
    }
  }

  if (action.type === "DELETE_FILTERED_VODS") {
    return {
      ...state,
      filteredFavs: action.payload,
    }
  }

  if (action.type === "SET_MODE") {
    return {
      ...state,
      mode: action.payload,
    }
  }

  if (action.type === "SET_LOADED") {
    return {
      ...state,
      loaded: action.payload,
    }
  }

  if (action.type === "OPEN_MODAL") {
    const modal = document.getElementById("modal")
    modal.style.display = "block"
    return {
      ...state,
      videoId: action.payload,
    }
  }

  if (action.type === "CLOSE_MODAL") {
    const modal = document.getElementById("modal")
    modal.style.display = "none"
    return {
      ...state,
      videoId: action.payload,
    }
  }

  return new Error("Error - No match with action.type")
}

const defaultState = {
  username: "",
  filterText: "",
  filtering: false,
  filteredFavs: [],
  vods: [],
  favs: JSON.parse(localStorage.getItem("favs")) || [],
  mode: "vods",
  loaded: false,
  videoId: "",
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState)

  document.addEventListener("keydown", (e) => {
    if (e.code === "Slash") {
      e.preventDefault()
      const input = document.querySelector(".form__username")
      input.focus()
    }
  })

  const getTwitchUser = async (username) => {
    showSpinner()
    const res = await fetch(
      `https://api.twitch.tv/helix/users?login=${username}`,
      {
        headers: {
          "Client-Id": process.env.REACT_APP_CLIENT_ID,
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
          "Client-Id": process.env.REACT_APP_CLIENT_ID,
          Authorization: process.env.REACT_APP_TOKEN,
        },
      }
    )

    const data = await res.json()

    dispatch({
      type: "LOAD_VODS",
      payload: data.data,
    })

    removeSpinner()
  }

  function showSpinner() {
    document.querySelector(".spinner").classList.add("show")
  }

  function removeSpinner() {
    document.querySelector(".spinner").classList.remove("show")
  }

  useEffect(() => {
    localStorage.setItem("favs", JSON.stringify(state.favs))
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
            element={<Favorites state={state} dispatch={dispatch} />}
          />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
