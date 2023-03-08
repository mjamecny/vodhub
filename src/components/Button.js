import "./Button.css"

export default function Button(props) {
  return (
    <button
      className="btn"
      onClick={() => {
        props.dispatch({
          type: "DELETE_ALL",
          payload: [],
        })
        props.dispatch({ type: "DELETE_FILTERED_VODS", payload: [] })
        props.dispatch({ type: "SET_FILTERING", payload: false })
      }}
    >
      Delete All
    </button>
  )
}
