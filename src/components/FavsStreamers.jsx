import {
  Flex,
  Text,
  Center,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  useToast,
  Button,
  useDisclosure,
  Box,
  Avatar,
  Tooltip,
  Icon,
} from '@chakra-ui/react'

import { DeleteIcon } from '@chakra-ui/icons'
import { FaHeart, FaRegCalendarAlt, FaTv } from 'react-icons/fa'

import { removedStreamer, removedAllStreamers } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import NoContent from './NoContent'
import ModalWindow from './ModalWindow'
import FormattedFollows from './FormattedFollows'
import OnlineChecker from './OnlineChecker'

const FavsStreamers = () => {
  const { streamers } = useSelector((state) => state.fav.favs)
  const dispatch = useDispatch()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const changeDateFormat = (date) => {
    const newDate = new Date(date)
    return [newDate.getMonth(), newDate.getDate(), newDate.getFullYear()]
  }

  const changeNumberFormat = (number) => {
    return number.toLocaleString('en-US').replace(/,/g, ' ')
  }

  const handleRemoveStreamer = (id) => {
    dispatch(removedStreamer(id))
    toast({
      description: 'Removed from your favorites',
      status: 'info',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleDeleteAllStreamers = () => {
    dispatch(removedAllStreamers())
    toast({
      description: 'Your favorites streamers are empty now',
      status: 'info',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }

  useEffect(() => {
    localStorage.setItem('streamers', JSON.stringify(streamers))
  }, [streamers])

  return (
    <>
      <Box flex="1">
        <Center mt="2rem" gap="1rem">
          <NavLink
            to="/favorites/vods"
            className={({ isActive }) =>
              isActive ? 'activeLink' : 'nonactiveLink'
            }
          >
            <Button size="md">Vods</Button>
          </NavLink>
          <NavLink
            to="/favorites/clips"
            className={({ isActive }) =>
              isActive ? 'activeLink' : 'nonactiveLink'
            }
          >
            <Button size="md">Clips</Button>
          </NavLink>
          <NavLink
            to="/favorites/streamers"
            className={({ isActive }) =>
              isActive ? 'activeLink' : 'nonactiveLink'
            }
          >
            <Button size="md">Streamers</Button>
          </NavLink>
        </Center>
        {streamers.length === 0 ? (
          <NoContent
            msg="Do not have any favorite streamers saved yet? No problem! Just browse
            selection of videos or clips from any Twitch streamer and click the plus button to add them to your favorites."
          />
        ) : (
          <>
            <Center mt="2rem">
              <Button
                size="sm"
                alignSelf="center"
                onClick={handleDeleteAllStreamers}
              >
                Delete All
              </Button>
            </Center>
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
              spacing="1rem"
              px={{ base: '1rem', sm: '2.5rem' }}
              pt="0.5rem"
            >
              {streamers.map((streamer) => {
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
                    <CardBody>
                      <Flex
                        flexDirection="column"
                        align="center"
                        gap="1rem"
                        height="200px"
                      >
                        <Avatar name={login} src={profile_image_url} />
                        <OnlineChecker streamer={login} />
                        <Text>{description}</Text>
                      </Flex>

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
              })}
            </SimpleGrid>
          </>
        )}
      </Box>
      <ModalWindow isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default FavsStreamers
