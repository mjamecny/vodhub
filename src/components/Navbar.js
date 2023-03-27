import { NavLink, Link, useNavigate } from "react-router-dom"
import logo from "../images/logo.png"
import { SearchIcon } from "@chakra-ui/icons"
import {
  Image,
  Flex,
  Button,
  FormControl,
  Input,
  IconButton,
  Center,
} from "@chakra-ui/react"

const Navbar = (props) => {
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
      props.getTwitchUser(props.state.username, navigate)
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

  return (
    <Flex
      bg="#212529"
      flexDirection={{
        base: "column",
        md: "row",
      }}
      justifyContent="space-between"
      alignItems="center"
      gap={{ base: "2rem" }}
    >
      <Link
        to="/"
        onClick={() => {
          props.dispatch({ type: "SET_MODE", payload: "vods" })
          props.dispatch({ type: "SET_FILTERING", payload: false })
          props.dispatch({ type: "DELETE_FILTERED_VODS", payload: [] })
        }}
      >
        <Image width="200px" src={logo} alt="Logo" />
      </Link>

      {props.state.mode === "vods" ? (
        <FormControl>
          <Center>
            <Input
              width="50%"
              type="text"
              placeholder="Twitch username"
              _placeholder={{ opacity: 1, color: "gray.500" }}
              bg="#fff"
              name="username"
              value={props.state.username}
              onChange={(e) =>
                props.dispatch({
                  type: "CHANGE_USERNAME",
                  payload: e.target.value,
                })
              }
            />
            <IconButton
              marginLeft="1.5rem"
              aria-label="Search database"
              icon={<SearchIcon />}
              onClick={formSubmit}
            />
          </Center>
        </FormControl>
      ) : (
        <FormControl>
          <Center>
            <Input
              width="50%"
              type="text"
              placeholder="Search in VOD title"
              _placeholder={{ opacity: 1, color: "gray.500" }}
              bg="#fff"
              name="filterText"
              value={props.state.filterText}
              onChange={(e) =>
                props.dispatch({
                  type: "CHANGE_FILTER_TEXT",
                  payload: e.target.value,
                })
              }
            />

            <IconButton
              marginLeft="1.5rem"
              aria-label="Search database"
              icon={<SearchIcon />}
              onClick={formFilterSubmit}
            />
          </Center>
        </FormControl>
      )}

      <Flex gap="2rem" marginRight="2rem">
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
          <Button
            bg="#ff6b6b"
            _hover={{
              bg: "#ffa8a8",
            }}
            color="#fff"
            textTransform="uppercase"
          >
            Home
          </Button>
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
          <Button
            bg="#ff6b6b"
            _hover={{
              bg: "#ffa8a8",
            }}
            color="#fff"
            textTransform="uppercase"
          >
            Favorites
          </Button>
        </NavLink>
      </Flex>
    </Flex>
  )
}

export default Navbar
