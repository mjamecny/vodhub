import {
  Grid,
  Box,
  Button,
  Heading,
  Icon,
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
} from "@chakra-ui/react"
import { FaRegTrashAlt, FaRegClock, FaRegCalendarAlt } from "react-icons/fa"
import { useEffect } from "react"

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

  return (
    <Box
      bg="#212529"
      color="#ced4da"
      flexGrow="1"
      flexShrink="1"
      paddingY="3.2rem"
      paddingX="8rem"
    >
      {state.favs.length !== 0 ? (
        <Flex flexDirection="column" gap="2rem">
          <Button
            bg="#ff6b6b"
            _hover={{
              bg: "#ffa8a8",
            }}
            color="#fff"
            textTransform="uppercase"
            width="xs"
            alignSelf="center"
            onClick={() => {
              dispatch({
                type: "REMOVE_FAVS",
                payload: [],
              })
              dispatch({
                type: "REMOVE_USERS",
                payload: [],
              })
              dispatch({ type: "DELETE_FILTERED_VODS", payload: [] })
              dispatch({ type: "SET_FILTERING", payload: false })
            }}
          >
            Delete All
          </Button>
          <Grid templateColumns="repeat(4, 1fr)" gap="2.4rem">
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
                    "1280x720"
                  )

                  const date = new Date(published_at)

                  const [month, day, year] = [
                    date.getMonth(),
                    date.getDate(),
                    date.getFullYear(),
                  ]

                  return (
                    <Flex
                      border="2px solid #555"
                      borderRadius="11px"
                      flexDirection="column"
                      overflow="hidden"
                      gap="1rem"
                      key={id}
                    >
                      <Image src={final_src} alt="thumbnail" />
                      <Flex
                        fontSize="sm"
                        padding="1.2rem"
                        flexDirection="column"
                        flexGrow="1"
                        flexShrink="1"
                        gap="1.75rem"
                      >
                        <Heading
                          flexGrow="1"
                          flexShrink="1"
                          fontSize="lg"
                          cursor="pointer"
                          color="#ff6b6b"
                          _hover={{
                            color: "#ffa8a8",
                          }}
                          onClick={() => {
                            onOpen()
                            dispatch({
                              type: "OPEN_MODAL",
                              payload: `https://player.twitch.tv/?video=${id}${
                                process.env.NODE_ENV === "development"
                                  ? "&parent=localhost"
                                  : `&parent=${process.env.REACT_APP_URL}`
                              }`,
                            })
                          }}
                        >
                          {title}
                        </Heading>
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          gap=".5rem"
                        >
                          <Flex
                            justifyContent="center"
                            alignItems="center"
                            gap=".5rem"
                          >
                            <Icon as={FaRegCalendarAlt} />
                            <Text>{`${day}/${month + 1}/${year}`}</Text>
                          </Flex>
                          <Icon
                            as={FaRegTrashAlt}
                            cursor="pointer"
                            _hover={{
                              color: "#ffa8a8",
                            }}
                            onClick={() => {
                              dispatch({
                                type: "REMOVE_FAV",
                                payload: id,
                              })

                              dispatch({
                                type: "REMOVE_USER",
                                payload: user_id,
                              })

                              toast({
                                description: "VOD deleted from your favorites",
                                status: "info",
                                duration: 5000,
                                position: "top",
                                isClosable: false,
                              })
                            }}
                            data-id={id}
                          />

                          <Flex
                            justifyContent="center"
                            alignItems="center"
                            gap=".5rem"
                          >
                            <Icon as={FaRegClock} />
                            <Text>{duration}</Text>
                          </Flex>
                        </Flex>

                        <Popover>
                          <PopoverTrigger>
                            <Link
                              href="#"
                              alignSelf="center"
                              onClick={() => {
                                getDetails(user_login)
                              }}
                            >
                              {user_login}
                            </Link>
                          </PopoverTrigger>
                          <PopoverContent color="#000">
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                              {state.users.map((user) => {
                                const {
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
                                    >
                                      <Avatar
                                        name={login}
                                        src={profile_image_url}
                                      />
                                      <Text>{description}</Text>
                                      <Text>{`${day}/${
                                        month + 1
                                      }/${year}`}</Text>
                                    </Flex>
                                  )
                                }
                              })}
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Flex>
                    </Flex>
                  )
                })
              : state.filteredFavs.map((fav) => {
                  const {
                    id,
                    thumbnail_url,
                    user_login,
                    title,
                    published_at,
                    duration,
                  } = fav

                  const final_src = thumbnail_url.replace(
                    /%{width}x%{height}/g,
                    "1280x720"
                  )

                  const date = new Date(published_at)

                  const [month, day, year] = [
                    date.getMonth(),
                    date.getDate(),
                    date.getFullYear(),
                  ]

                  return (
                    <Flex
                      border="2px solid #555"
                      borderRadius="11px"
                      flexDirection="column"
                      overflow="hidden"
                      gap="1rem"
                      key={id}
                    >
                      <Image src={final_src} alt="thumbnail" />
                      <Flex
                        fontSize="sm"
                        padding="1.2rem"
                        flexDirection="column"
                        gap="1.75rem"
                      >
                        <Heading
                          flexGrow="1"
                          flexShrink="1"
                          fontSize="lg"
                          cursor="pointer"
                          color="#ff6b6b"
                          _hover={{
                            color: "#ffa8a8",
                          }}
                          onClick={() => {
                            dispatch({
                              type: "OPEN_MODAL",
                              payload: `https://player.twitch.tv/?video=${id}${
                                process.env.NODE_ENV === "development"
                                  ? "&parent=localhost"
                                  : `&parent=${process.env.REACT_APP_URL}`
                              }`,
                            })
                          }}
                        >
                          {title}
                        </Heading>
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          gap=".5rem"
                        >
                          <Flex
                            justifyContent="center"
                            alignItems="center"
                            gap=".5rem"
                          >
                            <Icon as={FaRegCalendarAlt} />
                            <Text>{`${day}/${month + 1}/${year}`}</Text>
                          </Flex>
                          <Icon
                            as={FaRegTrashAlt}
                            cursor="pointer"
                            _hover={{
                              color: "#ffa8a8",
                            }}
                            onClick={() => {
                              dispatch({
                                type: "REMOVE_FAV",
                                payload: id,
                              })

                              dispatch({
                                type: "REMOVE_FILTER_FAV",
                                payload: id,
                              })

                              toast({
                                description: "VOD deleted from your favorites",
                                status: "info",
                                duration: 5000,
                                position: "top",
                                isClosable: false,
                              })
                            }}
                            data-id={id}
                          />

                          <Flex
                            justifyContent="center"
                            alignItems="center"
                            gap=".5rem"
                          >
                            <Icon as={FaRegClock} />
                            <Text>{duration}</Text>
                          </Flex>
                        </Flex>
                        <Text alignSelf="center">
                          <a
                            href={`https://twitch.tv/${user_login}`}
                            className="link"
                          >
                            {user_login}
                          </a>
                        </Text>
                      </Flex>
                    </Flex>
                  )
                })}
          </Grid>
        </Flex>
      ) : (
        <Flex
          fontSize="lg"
          justifyContent="center"
          alignItems="center"
          height="75vh"
        >
          Don't have any favorite videos saved yet? No problem! Just browse
          selection of videos from any Twitch streamer and click the "checkmark"
          button on any video you want to save for later.
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay />
        <ModalContent bg="blackAlpha.300" backdropFilter="blur(10px)">
          <ModalHeader color="#fff">VOD</ModalHeader>
          <ModalCloseButton
            bg="transparent"
            _hover={{
              bg: "transparent",
              color: "#ff6b6b",
            }}
            color="#fff"
          />
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
