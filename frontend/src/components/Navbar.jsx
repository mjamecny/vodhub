import {
  Flex,
  useColorMode,
  IconButton,
  Spacer,
  Image,
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

import { MoonIcon, SunIcon } from '@chakra-ui/icons'

import { FaUser } from 'react-icons/fa'

import { Link } from 'react-router-dom'

import { useLazyLogoutQuery, useRemoveCurrentUserMutation } from '../store'

import logo from '../assets/logo.png'

import FormSearch from './FormSearch'

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
  const [removeCurrentUser] = useRemoveCurrentUserMutation()
  const [logout] = useLazyLogoutQuery()
  const isAuthenticated = useIsAuthenticated()
  const signOut = useSignOut()
  const cancelRef = useRef()
  const { colorMode, toggleColorMode } = useColorMode()
  const toast = useToast()

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
    await removeCurrentUser({ token: authHeader(), id: auth()._id })
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
        {/* Mobile Menu */}
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
                    <Link to="/favorites/vods">
                      <MenuItem>Vods</MenuItem>
                    </Link>
                    <Link to="/favorites/clips">
                      <MenuItem>Clips</MenuItem>
                    </Link>
                    <Link to="/favorites/streamers">
                      <MenuItem>Streamers</MenuItem>
                    </Link>
                  </MenuGroup>
                  <MenuDivider />
                  {auth().role === 'admin' ? (
                    <MenuGroup title="Admin panel">
                      <Link to="/users">
                        <MenuItem>Manage Users</MenuItem>
                      </Link>
                      <MenuItem onClick={onOpen}>Delete account</MenuItem>
                      <Link to="/updatePassword">
                        <MenuItem>Change Password</MenuItem>
                      </Link>
                    </MenuGroup>
                  ) : (
                    <>
                      <MenuGroup title="User panel">
                        <MenuItem onClick={onOpen}>Delete account</MenuItem>
                        <Link to="/updatePassword">
                          <MenuItem>Change Password</MenuItem>
                        </Link>
                      </MenuGroup>
                    </>
                  )}

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
        <FormSearch />

        {/* Desktop Menu */}
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
                  <Link to="/favorites/vods">
                    <MenuItem>Vods</MenuItem>
                  </Link>
                  <Link to="/favorites/clips">
                    <MenuItem>Clips</MenuItem>
                  </Link>
                  <Link to="/favorites/streamers">
                    <MenuItem>Streamers</MenuItem>
                  </Link>
                </MenuGroup>
                {auth().role === 'admin' ? (
                  <>
                    <MenuDivider />
                    <MenuGroup title="Admin panel">
                      <Link to="/users">
                        <MenuItem>Manage Users</MenuItem>
                      </Link>
                      <MenuItem onClick={onOpen}>Delete account</MenuItem>
                      <Link to="/updatePassword">
                        <MenuItem>Change Password</MenuItem>
                      </Link>
                    </MenuGroup>
                  </>
                ) : (
                  <>
                    <MenuDivider />
                    <MenuGroup title="User panel">
                      <MenuItem onClick={onOpen}>Delete account</MenuItem>
                      <Link to="/updatePassword">
                        <MenuItem>Change Password</MenuItem>
                      </Link>
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
