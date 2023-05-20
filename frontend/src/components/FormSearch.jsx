import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Center,
  Kbd,
  RadioGroup,
  Stack,
  Radio,
  useToast,
} from '@chakra-ui/react'

import { SearchIcon } from '@chakra-ui/icons'

import { useHotkeys } from 'react-hotkeys-hook'

import {
  useLazyGetUserByNameQuery,
  setStreamer,
  setSearchedUsername,
  setUserId,
  setSearchMode,
  setErrorMsg,
} from '../store'

import { useIsAuthenticated } from 'react-auth-kit'

import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'

import { useNavigate } from 'react-router-dom'

const FormSearch = () => {
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const isAuthenticated = useIsAuthenticated()
  const toast = useToast()
  const [getUser] = useLazyGetUserByNameQuery()
  const { streamer, searchMode } = useSelector((state) => state.app)

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

  return (
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
  )
}
export default FormSearch
