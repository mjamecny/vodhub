import {
  Card,
  CardBody,
  Center,
  CardFooter,
  Button,
  IconButton,
  useToast,
  Text,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import { NavLink } from 'react-router-dom'

import { useAddStreamerMutation } from '../store'

import OnlineChecker from './OnlineChecker'
import { useAuthHeader } from 'react-auth-kit'

const StreamersListItem = ({ streamers }) => {
  const authHeader = useAuthHeader()
  const toast = useToast()
  const [addStreamer] = useAddStreamerMutation()

  const handleAddStreamer = async (id) => {
    const res = await addStreamer({ id, token: authHeader() })
    if (res.isError)
      return toast({
        description: res.error.data.message,
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: false,
      })

    toast({
      description: res.data.message,
      status: 'success',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  const renderedStreamers = streamers.map((streamer) => {
    const { id, broadcaster_login, thumbnail_url } = streamer

    return (
      <Card key={id} size={{ base: 'sm', md: 'md', lg: 'lg' }}>
        <CardBody display="flex" flexDirection="column" gap=".5rem">
          <Center>
            <OnlineChecker
              streamer={broadcaster_login}
              avatar={thumbnail_url}
            />
          </Center>
          <Text
            fontSize="lg"
            alignSelf="center"
            textTransform="uppercase"
            fontWeight="bold"
          >
            {broadcaster_login}
          </Text>
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
            onClick={() => handleAddStreamer(streamer.id)}
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
