import {
  Flex,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Heading,
  CardFooter,
  IconButton,
  useToast,
  useDisclosure,
  Box,
} from '@chakra-ui/react'

import {
  CopyIcon,
  DeleteIcon,
  CalendarIcon,
  RepeatClockIcon,
} from '@chakra-ui/icons'

import { removed, removedAll, setVodModalVideo } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import NoContent from './NoContent'
import ModalWindow from './ModalWindow'
import Share from './Share'
import DeleteAllButton from './DeleteAllButton'
import { changeImageSize, changeDateFormat } from '../utils'

const FavsVods = () => {
  const { vods } = useSelector((state) => state.fav.favs)
  const dispatch = useDispatch()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleRemoveVod = (vod) => {
    dispatch(removed(vod))
    toast({
      description: 'Removed from your favorites',
      status: 'info',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleDeleteAllVods = () => {
    dispatch(removedAll('vods'))
    toast({
      description: 'Your favorites VODs are empty now',
      status: 'info',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleCopyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
    toast({
      description: 'URL copied to clipboard',
      status: 'success',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleOpenModal = (id) => {
    onOpen()
    dispatch(setVodModalVideo(id))
  }

  useEffect(() => {
    localStorage.setItem('vods', JSON.stringify(vods))
  }, [vods])

  return (
    <>
      <Box flex="1">
        {vods.length === 0 ? (
          <NoContent
            msg="Do not have any favorite VODs saved yet? No problem! Just browse
          selection of VODs from any Twitch streamer and click the plus button
          on any VOD you want to save for later."
          />
        ) : (
          <>
            <DeleteAllButton handleDelete={handleDeleteAllVods} />
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
              spacing="1rem"
              px={{ base: '1rem', sm: '2.5rem' }}
              pt="0.5rem"
            >
              {vods.map((vod) => {
                const {
                  id,
                  thumbnail_url,
                  title,
                  duration,
                  url,
                  published_at,
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
                      <Flex
                        flexDirection="column"
                        gap="2rem"
                        mt="1rem"
                        height="150px"
                        justify="space-between"
                      >
                        <Heading
                          as="h2"
                          size="sm"
                          mt="1rem"
                          cursor="pointer"
                          transition={'all 0.3s'}
                          _hover={{ color: 'red.500' }}
                          onClick={() => handleOpenModal(id)}
                        >
                          {title}
                        </Heading>
                        <Flex justify="space-between" align="center">
                          <Flex justify="center" align="center" gap="0.5rem">
                            <CalendarIcon />
                            <Text>{`${day}/${month + 1}/${year}`}</Text>
                          </Flex>
                          <Flex gap="0.5rem">
                            <IconButton
                              onClick={() => handleRemoveVod(vod)}
                              aria-label="Remove from favorites"
                              icon={<DeleteIcon />}
                            />
                            <IconButton
                              onClick={() => handleCopyToClipboard(url)}
                              aria-label="Copy to clipboard"
                              icon={<CopyIcon />}
                            />
                          </Flex>

                          <Flex justify="center" align="center" gap="0.5rem">
                            <RepeatClockIcon />
                            <Text>{duration}</Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </CardBody>
                    <CardFooter
                      flexDirection="column"
                      justify="space-between"
                      align="center"
                      flexWrap="wrap"
                    >
                      <Share url={url} />
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
export default FavsVods
