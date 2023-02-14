import './Form.css'

export default function Form(props) {
  return (
    <form className="form" onSubmit={props.formSubmit}>
      <input
        className="form__username"
        type="text"
        placeholder="Username"
        name="username"
        value={props.username}
        onChange={(e) =>
          props.dispatch({
            type: 'CHANGE_USERNAME',
            payload: e.target.value,
          })
        }
      />
      <input className="form__submit" type="submit" />
    </form>
  )
}
