import "./Form.css"
import { useNavigate } from "react-router-dom"

export default function Form(props) {
  const navigate = useNavigate()

  const formSubmit = (e) => {
    e.preventDefault()

    if (props.state.mode === "favs") {
      navigate("/", { replace: true })
    }

    props.dispatch({
      type: "DELETE_ALL_VODS",
      payload: [],
    })

    props.dispatch({
      type: "SET_MODE",
      payload: "vods",
    })

    props.dispatch({ type: "SET_LOADED", payload: true })

    if (props.state.username) {
      props.getTwitchUser(props.state.username)
      props.dispatch({
        type: "SET_SEARCHED_STREAMER",
        payload: props.state.username,
      })
    } else {
      alert("Please fill the form")
    }

    props.dispatch({ type: "CHANGE_USERNAME", payload: "" })
  }

  const formFilterSubmit = (e) => {
    e.preventDefault()
    props.dispatch({ type: "SET_FILTERING", payload: true })
    props.dispatch({ type: "FILTER_FAVS_TITLE" })
    props.dispatch({ type: "CHANGE_FILTER_TEXT", payload: "" })
  }

  return props.state.mode === "vods" ? (
    <form className="form" onSubmit={formSubmit}>
      <input
        className="form__username"
        type="text"
        placeholder="Twitch username"
        name="username"
        value={props.state.username}
        onChange={(e) =>
          props.dispatch({
            type: "CHANGE_USERNAME",
            payload: e.target.value,
          })
        }
      />
      <input className="form__submit" type="submit" value="Search" />
    </form>
  ) : (
    <form className="form" onSubmit={formFilterSubmit}>
      <input
        className="form__username"
        type="text"
        placeholder="Search in VOD's title..."
        name="filterText"
        value={props.state.filterText}
        onChange={(e) =>
          props.dispatch({
            type: "CHANGE_FILTER_TEXT",
            payload: e.target.value,
          })
        }
      />
      <input className="form__submit" type="submit" value="Search" />
    </form>
  )
}
