import './Button.css'

export default function Button(props) {
  return (
    <button
      className="btn"
      onClick={() =>
        props.dispatch({
          type: 'DELETE_ALL',
          payload: [],
        })
      }
    >
      Delete All
    </button>
  )
}
