import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const SharedLayout = (props) => {
  return (
    <>
      <Navbar
        dispatch={props.dispatch}
        state={props.state}
        getTwitchUser={props.getTwitchUser}
      />
      <Outlet />
      <Footer />
    </>
  )
}

export default SharedLayout
