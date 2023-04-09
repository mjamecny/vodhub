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

const Home = ({
  state,
  dispatch,
  onOpen,
  changeImageSize,
  changeDateFormat,
  handleOpenModal,
}) => {
  const toast = useToast()

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
                          onClick={handleOpenModal}
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
    </Box>
  )
}

export default Home
