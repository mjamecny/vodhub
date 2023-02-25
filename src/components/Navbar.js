import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'
import Form from './Form'
import logo from '../images/logo.png'

const Navbar = (props) => {
  return (
    <header>
      <Link to="/">
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
            isActive ? 'activeLink' : 'nonactiveLink'
          }
          onClick={() => props.dispatch({ type: 'SET_MODE', payload: 'vods' })}
        >
          Home
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? 'activeLink' : 'nonactiveLink'
          }
          onClick={() => props.dispatch({ type: 'SET_MODE', payload: 'favs' })}
        >
          Favorites
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
