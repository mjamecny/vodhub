import {
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
  IconButton,
  Center,
  Kbd,
  Spacer,
  ButtonGroup,
  Button,
  Image,
  RadioGroup,
  Stack,
  Radio,
  useToast,
} from '@chakra-ui/react'
import { SearchIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'

import { useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useLazyGetUserByNameQuery } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import logo from '../assets/logo.png'
import {
  setUsername,
  setSearchedUsername,
  setUserId,
  setSearchMode,
  setErrorMsg,
} from '../store'

const Navbar = () => {
  const { username, searchMode, userId } = useSelector((state) => state.app)
  const [getUser] = useLazyGetUserByNameQuery()
  const inputRef = useRef(null)
  const { colorMode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()

  useHotkeys('ctrl + /', () => {
    inputRef.current.focus()
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (username === '') {
      toast({
        title: 'No username provided',
        description: 'Please enter a username',
        status: 'warning',
        position: 'top',
        duration: 5000,
        isClosable: false,
      })
      return
    }
    dispatch(setSearchedUsername(username))
    const result = await getUser(username)

    if (result.data.data.length === 0) {
      dispatch(setErrorMsg('Streamer not found'))
      navigate('*')
      return
    }

    dispatch(setUserId(result.data.data[0].id))
    dispatch(setUsername(''))
    if (searchMode === 'vods') navigate('/vods')
    if (searchMode === 'clips') navigate('/clips')
  }

  const handleChangeMode = (mode) => {
    dispatch(setSearchMode(mode))
  }

  return (
    <Flex
      mt={{ base: '0', lg: '2rem' }}
      flexDirection={{ base: 'column', lg: 'row' }}
      justify={{ base: 'center' }}
      align={{ base: 'center' }}
    >
      <Link to="/">
        <Image ml="1rem" width="200px" src={logo} alt="Logo" />
      </Link>
      <Spacer />
      <FormControl>
        <form onSubmit={handleSubmit}>
          <Center flexDirection={{ base: 'column', md: 'row' }}>
            <InputGroup
              w={{ base: '100%', md: '50%' }}
              // ml={{ base: '1rem', md: '0' }}
              // mr={{ base: '1rem', md: '0' }}
              size="lg"
            >
              <Input
                placeholder="Twitch username"
                name="username"
                value={username}
                onChange={(e) => dispatch(setUsername(e.target.value))}
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
              onClick={handleSubmit}
            />
            <RadioGroup
              ml="1rem"
              mt={{ base: '1rem', md: '0' }}
              onChange={handleChangeMode}
              value={searchMode}
            >
              <Stack direction="row">
                <Radio value="vods">Vods</Radio>
                <Radio value="clips">Clips</Radio>
              </Stack>
            </RadioGroup>
          </Center>
        </form>
      </FormControl>

      <ButtonGroup
        spacing="3"
        size="md"
        mr={{ base: 0, sm: '2rem' }}
        mt={{
          base: '2rem',
          lg: '0',
        }}
      >
        {userId && (
          <>
            <NavLink
              to="/vods"
              className={({ isActive }) =>
                isActive ? 'activeLink' : 'nonactiveLink'
              }
            >
              <Button>Vods</Button>
            </NavLink>
            <NavLink
              to="/clips"
              className={({ isActive }) =>
                isActive ? 'activeLink' : 'nonactiveLink'
              }
            >
              <Button>Clips</Button>
            </NavLink>
          </>
        )}

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? 'activeLink' : 'nonactiveLink'
          }
        >
          <Button>Favorites</Button>
        </NavLink>

        <IconButton
          size="md"
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