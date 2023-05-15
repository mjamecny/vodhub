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
  Center,
  Spinner,
} from '@chakra-ui/react'

import {
  CopyIcon,
  DeleteIcon,
  CalendarIcon,
  RepeatClockIcon,
} from '@chakra-ui/icons'

import {
  setClipModalVideo,
  useGetClipsQuery,
  useRemoveClipMutation,
  useRemoveAllClipsMutation,
  useLazyGetClipsByClipIdQuery,
  setClips,
} from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import NoContent from './NoContent'
import ModalWindow from './ModalWindow'
import Share from './Share'
import DeleteAllButton from './DeleteAllButton'
import { changeDateFormat } from '../utils'
import { useAuthHeader } from 'react-auth-kit'

const FavsClips = () => {
  const authHeader = useAuthHeader()
  const dispatch = useDispatch()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { clips } = useSelector((state) => state.app)
  const { clipIds, isFetching } = useGetClipsQuery(
    { token: authHeader() },
    {
      skip: !authHeader(),
      selectFromResult: ({ data, isFetching }) => {
        return {
          clipIds: data?.clips || [],
          isFetching,
        }
      },
    }
  )
  const [removeClip] = useRemoveClipMutation()
  const [removeAllClips] = useRemoveAllClipsMutation()
  const [getClipsByClipId] = useLazyGetClipsByClipIdQuery()

  const handleRemoveClip = async (id) => {
    await removeClip({ id, token: authHeader() })
    toast({
      description: 'Removed from your favorites',
      status: 'info',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleDeleteAllClips = async () => {
    await removeAllClips({ token: authHeader() })
    toast({
      description: 'Your favorites clips are empty now',
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
    dispatch(setClipModalVideo(id))
  }

  useEffect(() => {
    const getClips = async () => {
      if (!clipIds || clipIds.length === 0) return
      const res = await getClipsByClipId(clipIds)
      dispatch(setClips(res.data?.data))
    }

    getClips()
  }, [clipIds])

  return (
    <>
      <Box flex="1">
        {isFetching ? (
          <Center height="75vh">
            <Spinner size="xl" />
          </Center>
        ) : clipIds.length === 0 ? (
          <NoContent
            msg="Do not have any favorite clips saved yet? No problem! Just browse
            selection of clips from any Twitch streamer and click the plus button
            on any clip you want to save for later."
          />
        ) : (
          <>
            <DeleteAllButton handleDelete={handleDeleteAllClips} />
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
              spacing="1rem"
              px={{ base: '1rem', sm: '2.5rem' }}
              pt="0.5rem"
            >
              {clips.map((clip) => {
                const { id, thumbnail_url, title, created_at, duration, url } =
                  clip
                const [month, day, year] = changeDateFormat(created_at)

                return (
                  <Card key={id}>
                    <CardBody>
                      <Image
                        src={thumbnail_url}
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
                              onClick={() => handleRemoveClip(id)}
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
                            <Text>{Math.floor(duration)}s</Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </CardBody>
                    <CardFooter justify="center" align="center" flexWrap="wrap">
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
export default FavsClips
