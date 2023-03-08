import { NavLink, Link } from "react-router-dom"
import "./Navbar.css"
import Form from "./Form"
import logo from "../images/logo.png"

const Navbar = (props) => {
  return (
    <header>
      <Link
        to="/"
        onClick={() => {
          props.dispatch({ type: "SET_MODE", payload: "vods" })
          props.dispatch({ type: "SET_FILTERING", payload: false })
          props.dispatch({ type: "DELETE_FILTERED_VODS", payload: [] })
        }}
      >
        <img className="logo" src={logo} alt="Logo" />
      </Link>

      <Form
        state={props.state}
        dispatch={props.dispatch}
        getTwitchUser={props.getTwitchUser}
      />
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "activeLink" : "nonactiveLink"
          }
          onClick={() => {
            props.dispatch({ type: "SET_MODE", payload: "vods" })
            props.dispatch({ type: "SET_FILTERING", payload: false })
            props.dispatch({ type: "DELETE_FILTERED_VODS", payload: [] })
          }}
        >
          Home
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? "activeLink" : "nonactiveLink"
          }
          onClick={() => {
            props.dispatch({ type: "SET_MODE", payload: "favs" })
            props.dispatch({ type: "SET_FILTERING", payload: false })
            props.dispatch({ type: "DELETE_FILTERED_VODS", payload: [] })
          }}
        >
          Favorites
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
