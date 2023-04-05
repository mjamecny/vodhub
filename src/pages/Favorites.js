import {
  SimpleGrid,
  Box,
  Button,
  Heading,
  Image,
  Flex,
  Text,
  Link,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Avatar,
  Spinner,
  Card,
  CardBody,
  CardFooter,
  IconButton,
} from '@chakra-ui/react'
import { DeleteIcon, CalendarIcon, RepeatClockIcon } from '@chakra-ui/icons'
import { useEffect } from 'react'

const Favorites = ({ state, dispatch, getDetails }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    let usernames = []

    state.favs.forEach((fav) => {
      usernames.push(fav.user_login)
    })

    const uniqueUsernames = {}

    usernames.forEach((username) => {
      if (!uniqueUsernames[username]) {
        uniqueUsernames[username] = true
        getDetails(username)
      }
    })
  }, [state.favs])

  const handleRemoveFav = (id, user_id) => {
    dispatch({
      type: 'REMOVE_FAV',
      payload: id,
    })

    dispatch({
      type: 'REMOVE_USER',
      payload: user_id,
    })

    if (state.filtering) {
      dispatch({
        type: 'REMOVE_FILTER_FAV',
        payload: id,
      })

      dispatch({
        type: 'SET_FILTERING',
        payload: false,
      })
    }

    toast({
      description: 'VOD deleted from your favorites',
      status: 'info',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }

  return (
    <Box flexGrow="1" flexShrink="1">
      {state.favs.length !== 0 ? (
        <Flex flexDirection="column" gap="0.5rem" mt="2rem">
          <Button
            size="lg"
            alignSelf="center"
            onClick={() => {
              dispatch({
                type: 'REMOVE_FAVS',
                payload: [],
              })
              dispatch({
                type: 'REMOVE_USERS',
                payload: [],
              })
              dispatch({ type: 'DELETE_FILTERED_VODS', payload: [] })
              dispatch({ type: 'SET_FILTERING', payload: false })
            }}
          >
            Delete All
          </Button>
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
            spacing="1rem"
            p="2.5rem"
          >
            {!state.filtering
              ? state.favs.map((fav) => {
                  const {
                    id,
                    thumbnail_url,
                    user_login,
                    user_id,
                    title,
                    published_at,
                    duration,
                  } = fav

                  const final_src = thumbnail_url.replace(
                    /%{width}x%{height}/g,
                    '1280x720'
                  )

                  const date = new Date(published_at)

                  const [month, day, year] = [
                    date.getMonth(),
                    date.getDate(),
                    date.getFullYear(),
                  ]

                  return (
                    <Card key={id}>
                      <CardBody>
                        <Image
                          src={final_src}
                          fallbackSrc="https://via.placeholder.com/150"
                          borderRadius="lg"
                        />
                        <Heading
                          as="h2"
                          size="md"
                          mt="1rem"
                          cursor="pointer"
                          onClick={() => {
                            onOpen()
                            dispatch({
                              type: 'OPEN_MODAL',
                              payload: `https://player.twitch.tv/?video=${id}${
                                process.env.NODE_ENV === 'development'
                                  ? '&parent=localhost'
                                  : `&parent=${process.env.REACT_APP_URL}`
                              }`,
                            })
                          }}
                        >
                          {title}
                        </Heading>
                      </CardBody>
                      <CardFooter justify="space-between" align="center">
                        <Flex justify="center" align="center" gap="0.5rem">
                          <CalendarIcon />
                          <Text>{`${day}/${month + 1}/${year}`}</Text>
                        </Flex>
                        <IconButton
                          onClick={() => handleRemoveFav(id, user_id)}
                          aria-label="Remove from favorites"
                          icon={<DeleteIcon />}
                        />
                        <Flex justify="center" align="center" gap="0.5rem">
                          <RepeatClockIcon />
                          <Text>{duration}</Text>
                        </Flex>
                      </CardFooter>
                      <Popover>
                        <PopoverTrigger>
                          <Link
                            mb="1rem"
                            href="#"
                            alignSelf="center"
                            onClick={() => {
                              getDetails(user_login)
                            }}
                          >
                            {user_login}
                          </Link>
                        </PopoverTrigger>

                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverBody>
                            {state.users.map((user) => {
                              const {
                                id,
                                login,
                                profile_image_url,
                                description,
                                created_at,
                              } = user

                              const date = new Date(created_at)

                              const [month, day, year] = [
                                date.getMonth(),
                                date.getDate(),
                                date.getFullYear(),
                              ]

                              if (login === user_login) {
                                return (
                                  <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                    flexDirection="column"
                                    gap=".5rem"
                                    key={id}
                                  >
                                    <Avatar
                                      name={login}
                                      src={profile_image_url}
                                    />
                                    <Text>{description}</Text>
                                    <Text>{`${day}/${month + 1}/${year}`}</Text>
                                  </Flex>
                                )
                              }
                            })}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Card>
                  )
                })
              : state.filteredFavs.map((fav) => {
                  const {
                    id,
                    thumbnail_url,
                    user_id,
                    user_login,
                    title,
                    published_at,
                    duration,
                  } = fav

                  const final_src = thumbnail_url.replace(
                    /%{width}x%{height}/g,
                    '1280x720'
                  )

                  const date = new Date(published_at)

                  const [month, day, year] = [
                    date.getMonth(),
                    date.getDate(),
                    date.getFullYear(),
                  ]

                  return (
                    <Card key={id}>
                      <CardBody>
                        <Image
                          src={final_src}
                          fallbackSrc="https://via.placeholder.com/150"
                          borderRadius="lg"
                        />
                        <Heading
                          as="h2"
                          size="md"
                          mt="1rem"
                          cursor="pointer"
                          onClick={() => {
                            dispatch({
                              type: 'OPEN_MODAL',
                              payload: `https://player.twitch.tv/?video=${id}${
                                process.env.NODE_ENV === 'development'
                                  ? '&parent=localhost'
                                  : `&parent=${process.env.REACT_APP_URL}`
                              }`,
                            })
                          }}
                        >
                          {title}
                        </Heading>
                      </CardBody>
                      <CardFooter justify="space-between" align="center">
                        <Flex justify="center" align="center" gap="0.5rem">
                          <CalendarIcon />
                          <Text>{`${day}/${month + 1}/${year}`}</Text>
                        </Flex>
                        <IconButton
                          onClick={() => handleRemoveFav(id, user_id)}
                          aria-label="Remove from favorites"
                          icon={<DeleteIcon />}
                        />
                        <Flex justify="center" align="center" gap="0.5rem">
                          <RepeatClockIcon />
                          <Text>{duration}</Text>
                        </Flex>
                      </CardFooter>
                      <Popover>
                        <PopoverTrigger>
                          <Link
                            mb="1rem"
                            href="#"
                            alignSelf="center"
                            onClick={() => {
                              getDetails(user_login)
                            }}
                          >
                            {user_login}
                          </Link>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverBody>
                            {state.users.map((user) => {
                              const {
                                id,
                                login,
                                profile_image_url,
                                description,
                                created_at,
                              } = user

                              const date = new Date(created_at)

                              const [month, day, year] = [
                                date.getMonth(),
                                date.getDate(),
                                date.getFullYear(),
                              ]

                              if (login === user_login) {
                                return (
                                  <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                    flexDirection="column"
                                    gap=".5rem"
                                    key={id}
                                  >
                                    <Avatar
                                      name={login}
                                      src={profile_image_url}
                                    />
                                    <Text>{description}</Text>
                                    <Text>{`${day}/${month + 1}/${year}`}</Text>
                                  </Flex>
                                )
                              }
                            })}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Card>
                  )
                })}
          </SimpleGrid>
        </Flex>
      ) : (
        <Flex
          fontSize="lg"
          justifyContent="center"
          alignItems="center"
          height="75vh"
        >
          Don't have any favorite videos saved yet? No problem! Just browse
          selection of videos from any Twitch streamer and click the "plus"
          button on any video you want to save for later.
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay />
        <ModalContent backdropFilter="blur(10px)">
          <ModalHeader>VOD</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <iframe
              title="video"
              src={state.videoId}
              height="800"
              width="100%"
              allow="fullscreen"
              frameBorder="0"
            ></iframe>
          </ModalBody>
        </ModalContent>
      </Modal>

      {state.isVodsLoading && <Spinner />}
    </Box>
  )
}

export default Favorites
