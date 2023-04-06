import { NavLink, Link, useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'
import {
  Image,
  Flex,
  Button,
  ButtonGroup,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
  IconButton,
  Center,
  Spacer,
  Kbd,
} from '@chakra-ui/react'
import { SearchIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useHotkeys } from 'react-hotkeys-hook'
import { useRef } from 'react'

const Navbar = (props) => {
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()
  const inputRef = useRef(null)

  useHotkeys('ctrl + /', () => {
    inputRef.current.focus()
  })

  const formSubmit = (e) => {
    e.preventDefault()

    if (props.state.mode === 'favs') {
      navigate('/', { replace: true })
    }

    props.dispatch({
      type: 'DELETE_ALL_VODS',
      payload: [],
    })

    props.dispatch({
      type: 'SET_MODE',
      payload: 'vods',
    })

    props.dispatch({ type: 'SET_LOADED', payload: true })

    if (props.state.username) {
      props.getTwitchUser(props.state.username, navigate)
      props.dispatch({
        type: 'SET_SEARCHED_STREAMER',
        payload: props.state.username,
      })
    } else {
      alert('Please fill the form')
    }

    props.dispatch({ type: 'CHANGE_USERNAME', payload: '' })
  }

  const formFilterSubmit = (e) => {
    e.preventDefault()
    props.dispatch({ type: 'SET_FILTERING', payload: true })
    props.dispatch({ type: 'FILTER_FAVS_TITLE' })
    props.dispatch({ type: 'CHANGE_FILTER_TEXT', payload: '' })
  }

  return (
    <Flex
      justify="center"
      align="center"
      mt="20px"
      flexDirection={{
        base: 'column',
        lg: 'row',
      }}
    >
      <Link
        to="/"
        onClick={() => {
          props.dispatch({ type: 'SET_MODE', payload: 'vods' })
          props.dispatch({ type: 'SET_FILTERING', payload: false })
          props.dispatch({ type: 'DELETE_FILTERED_VODS', payload: [] })
        }}
      >
        <Image width="200px" src={logo} alt="Logo" />
      </Link>

      <Spacer />

      {props.state.mode === 'vods' ? (
        <FormControl>
          <form onSubmit={formSubmit}>
            <Center>
              <InputGroup
                w={{ base: '100%', md: '50%' }}
                ml={{ base: '1rem', md: '0' }}
                mr={{ base: '1rem', md: '0' }}
                size="lg"
              >
                <Input
                  placeholder="Twitch username"
                  name="username"
                  value={props.state.username}
                  onChange={(e) =>
                    props.dispatch({
                      type: 'CHANGE_USERNAME',
                      payload: e.target.value,
                    })
                  }
                  ref={inputRef}
                />
                <InputRightElement
                  display={{ base: 'none', lg: 'flex' }}
                  width="4.5rem"
                  mr="1rem"
                >
                  <Kbd>ctrl</Kbd> + <Kbd>/</Kbd>
                </InputRightElement>
              </InputGroup>

              <IconButton
                display={{ base: 'none', md: 'block' }}
                size="lg"
                marginLeft="1.5rem"
                aria-label="Search Twitch streamer"
                icon={<SearchIcon />}
                onClick={formSubmit}
              />
            </Center>
          </form>
        </FormControl>
      ) : (
        <FormControl isDisabled={props.state.favs.length === 0}>
          <form onSubmit={formFilterSubmit}>
            <Center>
              <InputGroup
                w={{ base: '100%', md: '50%' }}
                ml={{ base: '1rem', md: '0' }}
                mr={{ base: '1rem', md: '0' }}
                size="lg"
              >
                <Input
                  placeholder="Search in VOD title"
                  name="filterText"
                  value={props.state.filterText}
                  onChange={(e) =>
                    props.dispatch({
                      type: 'CHANGE_FILTER_TEXT',
                      payload: e.target.value,
                    })
                  }
                  ref={inputRef}
                />
                <InputRightElement
                  display={{ base: 'none', lg: 'flex' }}
                  width="4.5rem"
                  mr="1rem"
                >
                  <Kbd>ctrl</Kbd> + <Kbd>/</Kbd>
                </InputRightElement>
              </InputGroup>

              <IconButton
                display={{ base: 'none', md: 'block' }}
                size="lg"
                marginLeft="1.5rem"
                aria-label="Filter VODs"
                icon={<SearchIcon />}
                onClick={formFilterSubmit}
              />
            </Center>
          </form>
        </FormControl>
      )}

      <Spacer />

      <ButtonGroup
        spacing="3"
        size="lg"
        mr="2rem"
        mt={{
          base: '2rem',
          lg: '0',
        }}
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'activeLink' : 'nonactiveLink'
          }
          onClick={() => {
            props.dispatch({ type: 'SET_MODE', payload: 'vods' })
            props.dispatch({ type: 'SET_FILTERING', payload: false })
            props.dispatch({ type: 'DELETE_FILTERED_VODS', payload: [] })
          }}
        >
          <Button>Home</Button>
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? 'activeLink' : 'nonactiveLink'
          }
          onClick={() => {
            props.dispatch({ type: 'SET_MODE', payload: 'favs' })
            props.dispatch({ type: 'SET_FILTERING', payload: false })
            props.dispatch({ type: 'DELETE_FILTERED_VODS', payload: [] })
          }}
        >
          <Button>Favorites</Button>
        </NavLink>

        <IconButton
          size="lg"
          onClick={toggleColorMode}
          aria-label={
            colorMode === 'light'
              ? 'Change to dark mode'
              : 'Change to light mode'
          }
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        />
      </ButtonGroup>
    </Flex>
  )
}

export default Navbar
