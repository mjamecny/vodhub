import {
  Flex,
  Text,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  useToast,
  Button,
  Avatar,
  Tooltip,
  Icon,
  Center,
} from '@chakra-ui/react'

import { DeleteIcon } from '@chakra-ui/icons'
import { FaHeart, FaRegCalendarAlt, FaTv } from 'react-icons/fa'

import { useRemoveStreamerMutation } from '../store'

import OnlineChecker from './OnlineChecker'
import FormattedFollows from './FormattedFollows'

import { changeNumberFormat, changeDateFormat } from '../utils'
import { NavLink } from 'react-router-dom'

const FavStreamerItem = ({ streamers }) => {
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
      view_count,
    } = streamer
    const [month, day, year] = changeDateFormat(created_at)
    const formattedViews = changeNumberFormat(view_count)

    return (
      <Card key={id}>
        <CardBody display="flex" flexDirection="column" gap=".5rem">
          <Avatar
            alignSelf="center"
            size="md"
            name={login}
            src={profile_image_url}
          />
          <Center>
            <OnlineChecker streamer={login} id={id} />
          </Center>
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
              <Tooltip label="Total views">
                <span>
                  <Icon as={FaTv} />
                </span>
              </Tooltip>
              <Text>{formattedViews}</Text>
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
