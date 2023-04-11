import OnlineChecker from '../components/OnlineChecker'
import Welcome from '../components/Welcome'
import SpinnerVods from '../components/SpinnerVods'
import {
  Flex,
  Text,
  Heading,
  Image,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Box,
  useToast,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
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

import { CalendarIcon, AddIcon, RepeatClockIcon } from '@chakra-ui/icons'

const Home = ({ state, dispatch, changeImageSize, changeDateFormat }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleAddFav = (id) => {
    dispatch({
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

  const handleOpenModal = (id) => {
    onOpen()
    dispatch({
      type: 'OPEN_MODAL',
      payload: `https://player.twitch.tv/?video=${id}${
        process.env.NODE_ENV === 'development'
          ? '&parent=localhost'
          : `&parent=${process.env.REACT_APP_URL}`
      }`,
    })
  }

  return (
    <Box flexGrow="1" flexShrink="1">
      {!state.loaded ? (
        <Welcome />
      ) : (
        <Box>
          {state.isVodsLoading ? (
            <SpinnerVods />
          ) : (
            <Box>
              {state.searchedStreamer && (
                <OnlineChecker state={state} onOpen={onOpen} />
              )}
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
                spacing="1rem"
                p="2.5rem"
              >
                {state.vods.map((vod) => {
                  const {
                    id,
                    thumbnail_url,
                    title,
                    published_at,
                    duration,
                    url,
                  } = vod

                  const final_src = changeImageSize(thumbnail_url, '1280x720')
                  const [month, day, year] = changeDateFormat(published_at)

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
                          onClick={() => handleOpenModal(id)}
                        >
                          {title}
                        </Heading>
                      </CardBody>
                      <CardFooter
                        justify="space-between"
                        align="center"
                        flexWrap="wrap"
                      >
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

export default Home
