import {
  Flex,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  useToast,
  Button,
  Box,
  Avatar,
  Tooltip,
  Icon,
  Center,
  Spinner,
} from '@chakra-ui/react'

import { DeleteIcon } from '@chakra-ui/icons'
import { FaHeart, FaRegCalendarAlt, FaTv } from 'react-icons/fa'

import {
  useGetStreamersQuery,
  useRemoveStreamerMutation,
  useRemoveAllStreamersMutation,
  useLazyGetStreamersByStreamerIdQuery,
  setStreamers,
  useImportStreamersMutation,
} from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import NoContent from './NoContent'
import FormattedFollows from './FormattedFollows'
import OnlineChecker from './OnlineChecker'
import DeleteAllButton from './DeleteAllButton'

import { changeNumberFormat, changeDateFormat } from '../utils'
import { useAuthHeader, useSignOut } from 'react-auth-kit'

const FavsStreamers = () => {
  const signOut = useSignOut()
  const authHeader = useAuthHeader()
  const dispatch = useDispatch()
  const toast = useToast()

  const [importData] = useImportStreamersMutation()

  const { streamers } = useSelector((state) => state.app)

  const { streamerIds, isFetching } = useGetStreamersQuery(
    { token: authHeader() },
    {
      skip: !authHeader(),
      selectFromResult: ({ data, isError, isFetching }) => {
        if (isError) signOut()
        return {
          streamerIds: data?.streamers || [],
          isFetching,
        }
      },
    }
  )

  const [getStreamersByStreamerId] = useLazyGetStreamersByStreamerIdQuery()
  const [removeStreamer] = useRemoveStreamerMutation()
  const [removedAllStreamers] = useRemoveAllStreamersMutation()

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

  const handleDeleteAllStreamers = async () => {
    await removedAllStreamers({ token: authHeader() })
    toast({
      description: 'Your favorites streamers are empty now',
      status: 'info',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleExport = () => {
    const jsonData = JSON.stringify(streamerIds)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'streamers.json'
    link.click()
  }

  const handleImport = (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const streamerIds = JSON.parse(event.target.result)
        const res = await importData({ streamerIds, token: authHeader() })
      } catch (error) {
        toast({
          description: 'Invalid format',
          status: 'error',
          duration: 3000,
          position: 'top',
          isClosable: false,
        })
      }
    }
    reader.readAsText(e.target.files[0])
  }

  useEffect(() => {
    const getStreamers = async () => {
      if (!streamerIds || streamerIds.length === 0) return
      const res = await getStreamersByStreamerId(streamerIds)
      dispatch(setStreamers(res.data?.data))
    }

    getStreamers()
  }, [streamerIds])

  return (
    <>
      <Box flex="1">
        {isFetching ? (
          <Center height="75vh">
            <Spinner size="xl" />
          </Center>
        ) : streamerIds.length === 0 ? (
          <>
            <Center mt="2rem" gap="1rem">
              <Text>Import streamers</Text>
              <input type="file" onChange={handleImport} />
            </Center>

            <NoContent
              msg="Do not have any favorite streamers saved yet? No problem! Just browse
            selection of videos or clips from any Twitch streamer and click the plus button to add them to your favorites or import your own JSON file."
            />
          </>
        ) : (
          <>
            <Flex justify="center" gap="1rem">
              <DeleteAllButton handleDelete={handleDeleteAllStreamers} />
              <Button mt="2rem" onClick={handleExport}>
                Export JSON
              </Button>
            </Flex>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
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
              })}
            </SimpleGrid>
          </>
        )}
      </Box>
    </>
  )
}
export default FavsStreamers
