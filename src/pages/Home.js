import { FaCheck, FaRegClock, FaRegCalendarAlt } from "react-icons/fa"
import {
  Box,
  Flex,
  Center,
  Icon,
  Text,
  Heading,
  Image,
  Grid,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
} from "@chakra-ui/react"

const Home = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  return (
    <Box
      bg="#212529"
      color="#ced4da"
      flexGrow="1"
      flexShrink="1"
      paddingY="3.2rem"
      paddingX={{ base: "3.2rem", md: "8rem" }}
    >
      {!props.state.loaded ? (
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="75vh"
        >
          <Heading>Welcome to VODhub</Heading>
          <Text>Search and add to Favorites Twitch VODs</Text>
        </Flex>
      ) : (
        <Box>
          {props.state.isVodsLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <Box>
              {props.state.searchedStreamer && (
                <Text fontSize="lg" textAlign="center" mb="2rem">
                  {props.state.searchedStreamer} is{" "}
                  {Object.keys(props.state.stream).length !== 0
                    ? "online"
                    : "offline"}
                </Text>
              )}
              <Grid
                templateColumns={{
                  base: "repeat(1,1fr)",
                  md: "repeat(4,1fr)",
                }}
                gap="2.4rem"
              >
                {props.state.vods.map((vod) => {
                  const { id, thumbnail_url, title, published_at, duration } =
                    vod

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
                            props.dispatch({
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
                            as={FaCheck}
                            data-id={id}
                            cursor="pointer"
                            _hover={{
                              color: "#ffa8a8",
                            }}
                            onClick={(e) => {
                              props.dispatch({
                                type: "ADD_FAV",
                                payload: e.currentTarget.dataset.id,
                              })

                              toast({
                                description: "VOD added to your favorites",
                                status: "success",
                                duration: 5000,
                                position: "top",
                                isClosable: false,
                              })
                            }}
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
                      </Flex>
                    </Flex>
                  )
                })}
              </Grid>
            </Box>
          )}
        </Box>
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
              src={props.state.videoId}
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

export default Home
