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
  Image,
  RadioGroup,
  Stack,
  Radio,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react'
import { SearchIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'

import { FaUser } from 'react-icons/fa'

import { useHotkeys } from 'react-hotkeys-hook'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  useLazyGetUserByNameQuery,
  useLazyLogoutQuery,
  useRemoveCurrentUserMutation,
} from '../store'
import { useDispatch, useSelector } from 'react-redux'
import logo from '../assets/logo.png'
import {
  setStreamer,
  setSearchedUsername,
  setUserId,
  setSearchMode,
  setErrorMsg,
} from '../store'
import {
  useIsAuthenticated,
  useSignOut,
  useAuthUser,
  useAuthHeader,
} from 'react-auth-kit'

import { useRef } from 'react'

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const auth = useAuthUser()
  const authHeader = useAuthHeader()
  const { streamer, searchMode } = useSelector((state) => state.app)
  const [removeCurrentUser] = useRemoveCurrentUserMutation()
  const [getUser] = useLazyGetUserByNameQuery()
  const [logout] = useLazyLogoutQuery()
  const isAuthenticated = useIsAuthenticated()
  const signOut = useSignOut()
  const inputRef = useRef(null)
  const cancelRef = useRef()
  const { colorMode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()

  useHotkeys('ctrl + /', () => {
    inputRef.current.focus()
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (streamer === '') {
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
    dispatch(setSearchedUsername(streamer))
    if (searchMode === 'streamers') {
      dispatch(setStreamer(''))
      navigate('/streamers')
    } else {
      const result = await getUser(streamer)
      if (result.data.data.length === 0) {
        dispatch(setErrorMsg('Streamer not found'))
        navigate('*')
        return
      }
      dispatch(setUserId(result.data.data[0].id))
      dispatch(setStreamer(''))
      if (searchMode === 'vods') navigate('/vods')
      if (searchMode === 'clips') navigate('/clips')
    }
  }

  const handleChangeMode = (mode) => {
    dispatch(setSearchMode(mode))
  }

  const handleSignOut = async () => {
    const refreshToken = localStorage.getItem('_auth_refresh')
    const res = await logout({ authToken: authHeader(), refreshToken })

    if (res.isSuccess) {
      signOut()
      toast({
        title: 'Logged out',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: false,
      })
    }
  }

  const handleDeleteAccount = async () => {
    onClose()
    const res = await removeCurrentUser({ token: authHeader(), id: auth()._id })
    signOut()
  }

  return (
    <>
      <Flex
        mt={{ base: '0', lg: '2rem' }}
        flexDirection={{ base: 'column', lg: 'row' }}
        justify={{ base: 'center' }}
        align={{ lg: 'center' }}
      >
        <Link to="/">
          <Image
            display={{ base: 'none', lg: 'block' }}
            ml="1rem"
            width="200px"
            src={logo}
            alt="Logo"
          />
        </Link>
        <Flex
          display={{ base: 'flex', lg: 'none' }}
          align="center"
          justify="space-between"
        >
          <Link to="/">
            <Image width="150px" src={logo} alt="Logo" />
          </Link>
          <Flex gap=".5rem" mr="1rem">
            {isAuthenticated() && (
              <Menu>
                <MenuButton px={4} py={2} borderRadius="md" borderWidth="1px">
                  <Flex align="center" gap=".5rem">
                    <FaUser /> {auth().username}
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuGroup title="Favourites">
                    <NavLink
                      to="/favorites/vods"
                      className={({ isActive }) =>
                        isActive ? 'activeLink' : 'nonactiveLink'
                      }
                    >
                      <MenuItem>Vods</MenuItem>
                    </NavLink>
                    <NavLink
                      to="/favorites/clips"
                      className={({ isActive }) =>
                        isActive ? 'activeLink' : 'nonactiveLink'
                      }
                    >
                      <MenuItem>Clips</MenuItem>
                    </NavLink>
                    <NavLink
                      to="/favorites/streamers"
                      className={({ isActive }) =>
                        isActive ? 'activeLink' : 'nonactiveLink'
                      }
                    >
                      <MenuItem>Streamers</MenuItem>
                    </NavLink>
                  </MenuGroup>
                  <MenuDivider />
                  {auth().role === 'admin' ? (
                    <MenuGroup title="Admin panel">
                      <NavLink
                        to="/users"
                        className={({ isActive }) =>
                          isActive ? 'activeLink' : 'nonactiveLink'
                        }
                      >
                        <MenuItem>Users</MenuItem>
                      </NavLink>
                    </MenuGroup>
                  ) : null}

                  <MenuDivider />
                  <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
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
          </Flex>
        </Flex>

        <Spacer />
        <FormControl isDisabled={!isAuthenticated()}>
          <form onSubmit={handleSubmit}>
            <Center flexDirection={{ base: 'column', md: 'row' }}>
              <InputGroup w={{ base: '90%', md: '50%' }} size={{ base: 'lg' }}>
                <Input
                  placeholder="Twitch username"
                  name="streamer"
                  value={streamer}
                  onChange={(e) => dispatch(setStreamer(e.target.value))}
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
                isDisabled={!isAuthenticated()}
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
                  <Radio value="streamers">Streamers</Radio>
                </Stack>
              </RadioGroup>
            </Center>
          </form>
        </FormControl>

        <Flex
          display={{ base: 'none', lg: 'flex' }}
          align="center"
          mt={{ base: '2rem', lg: 0 }}
          mr="1rem"
          gap="1rem"
        >
          {isAuthenticated() && (
            <Menu>
              <MenuButton px={4} py={2} borderRadius="md" borderWidth="1px">
                <Flex align="center" gap=".5rem">
                  <FaUser /> {auth().username}
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuGroup title="Favourites">
                  <NavLink
                    to="/favorites/vods"
                    className={({ isActive }) =>
                      isActive ? 'activeLink' : 'nonactiveLink'
                    }
                  >
                    <MenuItem>Vods</MenuItem>
                  </NavLink>
                  <NavLink
                    to="/favorites/clips"
                    className={({ isActive }) =>
                      isActive ? 'activeLink' : 'nonactiveLink'
                    }
                  >
                    <MenuItem>Clips</MenuItem>
                  </NavLink>
                  <NavLink
                    to="/favorites/streamers"
                    className={({ isActive }) =>
                      isActive ? 'activeLink' : 'nonactiveLink'
                    }
                  >
                    <MenuItem>Streamers</MenuItem>
                  </NavLink>
                </MenuGroup>
                {auth().role === 'admin' ? (
                  <>
                    <MenuDivider />
                    <MenuGroup title="Admin panel">
                      <NavLink
                        to="/users"
                        className={({ isActive }) =>
                          isActive ? 'activeLink' : 'nonactiveLink'
                        }
                      >
                        <MenuItem>Users</MenuItem>
                      </NavLink>
                    </MenuGroup>
                  </>
                ) : (
                  <>
                    <MenuDivider />
                    <MenuGroup title="User panel">
                      <MenuItem onClick={onOpen}>Delete account</MenuItem>
                    </MenuGroup>
                  </>
                )}

                <MenuDivider />
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}

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
        </Flex>
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default Navbar
