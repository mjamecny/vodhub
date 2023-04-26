import {
  Avatar,
  Card,
  CardBody,
  Center,
  CardFooter,
  Button,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { NavLink } from 'react-router-dom'

import { useLazyGetUserByNameQuery, added } from '../store'

import OnlineChecker from './OnlineChecker'
import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

const StreamersListItem = ({ streamers }) => {
  const toast = useToast()
  const dispatch = useDispatch()
  const favStreamers = useSelector((state) => state.fav.favs.streamers)
  const [getUser] = useLazyGetUserByNameQuery()

  const handleAddStreamer = async (broadcaster_login) => {
    const result = await getUser(broadcaster_login)
    const streamer = result.data.data[0]
    const newStreamer = { ...streamer, isStreamer: true }
    dispatch(added(newStreamer))
    toast({
      description: 'Streamer added to your favorites',
      status: 'success',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  useEffect(() => {
    localStorage.setItem('streamers', JSON.stringify(favStreamers))
  }, [favStreamers])

  const renderedStreamers = streamers.map((streamer) => {
    const { id, broadcaster_login, thumbnail_url } = streamer
    // sm: '30em',
    // md: '48em',
    // lg: '62em',
    // xl: '80em',
    // '2xl': '96em',
    return (
      <Card key={id} size={{ base: 'sm', md: 'md', lg: 'lg' }}>
        <CardBody display="flex" flexDirection="column" gap=".5rem">
          <Avatar
            alignSelf="center"
            size={{ base: 'sm', md: 'md', lg: 'lg' }}
            name={broadcaster_login}
            src={thumbnail_url}
          />
          <Center>
            <OnlineChecker streamer={broadcaster_login} />
          </Center>
        </CardBody>

        <CardFooter justify="space-around">
          <NavLink
            to={`/streamers/vods/${id}`}
            className={({ isActive }) =>
              isActive ? 'activeLink' : 'nonactiveLink'
            }
          >
            <Button size={{ base: 'sm', md: 'md', lg: 'lg' }}>Vods</Button>
          </NavLink>
          <IconButton
            size={{ base: 'sm', md: 'md', lg: 'lg' }}
            onClick={() => handleAddStreamer(streamer)}
            icon={<AddIcon />}
          />
          <NavLink
            to={`/streamers/clips/${id}`}
            className={({ isActive }) =>
              isActive ? 'activeLink' : 'nonactiveLink'
            }
          >
            <Button size={{ base: 'sm', md: 'md', lg: 'lg' }}>Clips</Button>
          </NavLink>
        </CardFooter>
      </Card>
    )
  })

  return <>{renderedStreamers}</>
}
export default StreamersListItem
