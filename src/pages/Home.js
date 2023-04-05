import {
  Box,
  Badge,
  Flex,
  Center,
  Text,
  Heading,
  Image,
  SimpleGrid,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Card,
  CardBody,
  CardFooter,
  IconButton,
} from '@chakra-ui/react'

import { CalendarIcon, AddIcon, RepeatClockIcon } from '@chakra-ui/icons'

const Home = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const handleAddFav = (id) => {
    props.dispatch({
      type: 'ADD_FAV',
      payload: id,
    })

    toast({
      description: 'VOD added to your favorites',
      status: 'success',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }

  return (
    <Box flexGrow="1" flexShrink="1">
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
            <Center height="75vh">
              <Spinner size="xl" />
            </Center>
          ) : (
            <Box>
              {props.state.searchedStreamer && (
                <Box width="15%" mt="2rem" mx="auto">
                  <Badge
                    fontSize="lg"
                    colorScheme={
                      Object.keys(props.state.stream).length !== 0
                        ? 'green'
                        : 'red'
                    }
                  >
                    {props.state.searchedStreamer} is{' '}
                    {Object.keys(props.state.stream).length !== 0
                      ? 'online'
                      : 'offline'}
                  </Badge>
                </Box>
              )}
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
                spacing="1rem"
                p="2.5rem"
              >
                {props.state.vods.map((vod) => {
                  const { id, thumbnail_url, title, published_at, duration } =
                    vod

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
                          fallbackSrc="https://via.placeholder.com/1280x720"
                          borderRadius="lg"
                        />
                        <Heading
                          as="h2"
                          size="md"
                          mt="1rem"
                          cursor="pointer"
                          onClick={() => {
                            onOpen()
                            props.dispatch({
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
                          onClick={() => handleAddFav(id)}
                          aria-label="Add to favorites"
                          icon={<AddIcon />}
                        />
                        <Flex justify="center" align="center" gap="0.5rem">
                          <RepeatClockIcon />
                          <Text>{duration}</Text>
                        </Flex>
                      </CardFooter>
                    </Card>
                  )
                })}
              </SimpleGrid>
            </Box>
          )}
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay />
        <ModalContent backdropFilter="blur(10px)">
          <ModalHeader>VOD</ModalHeader>
          <ModalCloseButton />
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
