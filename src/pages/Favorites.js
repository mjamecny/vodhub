import NoFavs from '../components/NoFavs'

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
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Center,
} from '@chakra-ui/react'
import {
  FacebookShareButton,
  PocketShareButton,
  TwitterShareButton,
  VKShareButton,
  WhatsappShareButton,
  FacebookIcon,
  PocketIcon,
  TwitterIcon,
  VKIcon,
  WhatsappIcon,
} from 'react-share'
import { DeleteIcon, CalendarIcon, RepeatClockIcon } from '@chakra-ui/icons'
import { useEffect } from 'react'

const Favorites = ({
  state,
  dispatch,
  getDetails,
  changeDateFormat,
  changeImageSize,
  handleOpenModal,
}) => {
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

  const handleDeleteAllFavs = () => {
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
  }

  return (
    <Box flexGrow="1" flexShrink="1">
      {state.favs.length !== 0 ? (
        <Flex flexDirection="column" gap="0.5rem" mt="2rem">
          <Button size="lg" alignSelf="center" onClick={handleDeleteAllFavs}>
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
                    url,
                  } = fav

                  const final_src = changeImageSize(thumbnail_url, '1280x720')
                  const [month, day, year] = changeDateFormat(published_at)

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
                          onClick={() => handleOpenModal(id)}
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
                      <Center mb="1rem" gap="0.5rem">
                        <TwitterShareButton url={url}>
                          <TwitterIcon size={18} />
                        </TwitterShareButton>
                        <FacebookShareButton url={url}>
                          <FacebookIcon size={18} />
                        </FacebookShareButton>
                        <WhatsappShareButton url={url}>
                          <WhatsappIcon size={18} />
                        </WhatsappShareButton>
                        <PocketShareButton url={url}>
                          <PocketIcon size={18} />
                        </PocketShareButton>
                        <VKShareButton url={url}>
                          <VKIcon size={18} />
                        </VKShareButton>
                      </Center>
                      <Popover>
                        <PopoverTrigger>
                          <Text
                            mb="1rem"
                            href="#"
                            alignSelf="center"
                            cursor="pointer"
                            onClick={() => {
                              getDetails(user_login)
                            }}
                          >
                            {user_login}
                          </Text>
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
                    url,
                    title,
                    published_at,
                    duration,
                  } = fav

                  const final_src = changeImageSize(thumbnail_url, '1280x720')
                  const [month, day, year] = changeDateFormat(published_at)

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
                      <Center mb="1rem" gap="0.5rem">
                        <TwitterShareButton url={url}>
                          <TwitterIcon size={18} />
                        </TwitterShareButton>
                        <FacebookShareButton url={url}>
                          <FacebookIcon size={18} />
                        </FacebookShareButton>
                        <WhatsappShareButton url={url}>
                          <WhatsappIcon size={18} />
                        </WhatsappShareButton>
                        <PocketShareButton url={url}>
                          <PocketIcon size={18} />
                        </PocketShareButton>
                        <VKShareButton url={url}>
                          <VKIcon size={18} />
                        </VKShareButton>
                      </Center>
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
        <NoFavs />
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
    </Box>
  )
}

export default Favorites
