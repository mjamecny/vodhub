import ModalWindow from './ModalWindow'

import {
  Button,
  Flex,
  Image,
  Text,
  Center,
  Badge,
  Link,
  Spinner,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react'

import {
  useGetIsStreamerOnlineQuery,
  setStreamModalVideo,
  useLazySubscribeToEventQuery,
} from '../store'
import { convertDuration } from '../utils'
import { useDispatch } from 'react-redux'

const OnlineChecker = ({ streamer, id }) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const dispatch = useDispatch()

  const { stream, isFetching } = useGetIsStreamerOnlineQuery(streamer, {
    pollingInterval: 300000, // re-fetch every 5 minutes (300000)
    selectFromResult: ({ data, isFetching }) => {
      return {
        stream: data?.data || [],
        isFetching,
      }
    },
  })

  const handleOpenModal = () => {
    onOpen()
    dispatch(setStreamModalVideo(streamer))
  }

  let duration

  if (stream.length !== 0) {
    duration = convertDuration(stream[0].started_at)
  }

  return (
    <>
      {isFetching ? (
        <Spinner />
      ) : Object.keys(stream).length !== 0 ? (
        <Popover>
          <PopoverTrigger>
            <Link>
              <Badge
                fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
                colorScheme="green"
              >
                {streamer} is online
              </Badge>
            </Link>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader mt="2rem">
              <Image
                borderRadius="5px"
                src={stream[0].thumbnail_url
                  .replace('{width}', '320')
                  .replace('{height}', '180')}
                alt="thumbnail"
              />
              <Text mt="1rem" fontSize="lg">
                {stream[0].title}
              </Text>
              <Flex justify="space-between">
                <Text textAlign="center" mt="1rem">
                  {stream[0].game_name}
                </Text>
                <Text textAlign="center" mt="1rem">
                  {duration}
                </Text>
              </Flex>
            </PopoverHeader>
            <PopoverBody>
              <Center>
                <Button alignSelf="center" onClick={handleOpenModal}>
                  Open Stream
                </Button>
              </Center>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : (
        <Badge fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} colorScheme="red">
          {streamer} is offline
        </Badge>
      )}
      <ModalWindow isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default OnlineChecker
