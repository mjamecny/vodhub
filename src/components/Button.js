import './Button.css'

export default function Button(props) {
  return (
    <>
      {props.state.mode === 'vods' ? (
        <button
          className="btn"
          onClick={() => props.dispatch({ type: 'SET_MODE', payload: 'favs' })}
        >
          Favorites
        </button>
      ) : (
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
      )}
    </>
  )
}
