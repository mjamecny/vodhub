import {
  Flex,
  Text,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  useToast,
  Button,
  Tooltip,
  Icon,
  Center,
} from '@chakra-ui/react'

import { DeleteIcon } from '@chakra-ui/icons'
import { FaHeart, FaRegCalendarAlt, FaTv, FaUser } from 'react-icons/fa'

import { useRemoveStreamerMutation } from '../store'

import OnlineChecker from './OnlineChecker'
import FormattedFollows from './FormattedFollows'

import { changeNumberFormat, changeDateFormat } from '../utils'
import { NavLink } from 'react-router-dom'

import { useAuthHeader } from 'react-auth-kit'

const FavStreamerItem = ({ streamers }) => {
  const authHeader = useAuthHeader()
  const toast = useToast()
  const [removeStreamer] = useRemoveStreamerMutation()

  const handleRemoveStreamer = async (id) => {
    await removeStreamer({ id, token: authHeader() })
    toast({
      description: 'Removed from your favorites',
      status: 'info',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  const renderedStreamers = streamers.map((streamer) => {
    const {
      id,
      login,
      description,
      profile_image_url,
      created_at,
      broadcaster_type,
    } = streamer
    const [month, day, year] = changeDateFormat(created_at)

    let streamerType

    if (broadcaster_type === 'affiliate') {
      streamerType = 'affiliate'
    } else if (broadcaster_type === 'partner') {
      streamerType = 'partner'
    } else {
      streamerType = 'normal'
    }

    return (
      <Card key={id}>
        <CardBody display="flex" flexDirection="column" gap=".5rem">
          <Center>
            <OnlineChecker
              streamer={login}
              id={id}
              avatar={profile_image_url}
            />
          </Center>
          <Text
            fontSize="lg"
            alignSelf="center"
            textTransform="uppercase"
            fontWeight="bold"
          >
            {login}
          </Text>
          <Text flex="1">{description}</Text>
          <Flex gap=".5rem" mt="1rem">
            <Flex
              flexDirection="column"
              justify="center"
              align="center"
              gap="0.25rem"
              flex="1"
            >
              <Tooltip label="Created">
                <span>
                  <Icon as={FaRegCalendarAlt} />
                </span>
              </Tooltip>
              <Text>{`${day}/${month + 1}/${year}`}</Text>
            </Flex>
            <Flex
              flexDirection="column"
              justify="center"
              align="center"
              gap="0.25rem"
              flex="1"
            >
              <Tooltip label="Total follows">
                <span>
                  <Icon as={FaHeart} />
                </span>
              </Tooltip>
              <FormattedFollows id={id} />
            </Flex>
            <Flex
              flexDirection="column"
              justify="center"
              align="center"
              gap="0.25rem"
              flex="1"
            >
              <Tooltip label="Streamer type">
                <span>
                  <Icon as={FaUser} />
                </span>
              </Tooltip>
              <Text>{streamerType}</Text>
            </Flex>
          </Flex>
        </CardBody>

        <CardFooter justify="space-around">
          <NavLink
            to={`/streamers/vods/${id}`}
            className={({ isActive }) =>
              isActive ? 'activeLink' : 'nonactiveLink'
            }
          >
            <Button>Vods</Button>
          </NavLink>
          <IconButton
            onClick={() => handleRemoveStreamer(id)}
            icon={<DeleteIcon />}
          />
          <NavLink
            to={`/streamers/clips/${id}`}
            className={({ isActive }) =>
              isActive ? 'activeLink' : 'nonactiveLink'
            }
          >
            <Button>Clips</Button>
          </NavLink>
        </CardFooter>
      </Card>
    )
  })
  return <>{renderedStreamers}</>
}
export default FavStreamerItem
