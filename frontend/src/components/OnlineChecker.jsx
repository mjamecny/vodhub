import ModalWindow from './ModalWindow'

import {
  Button,
  Flex,
  Image,
  Text,
  Center,
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
  Avatar,
  AvatarBadge,
} from '@chakra-ui/react'

import { useGetIsStreamerOnlineQuery, setStreamModalVideo } from '../store'
import { convertDuration } from '../utils'
import { useDispatch } from 'react-redux'

const OnlineChecker = ({ streamer, id, avatar }) => {
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
              <Avatar alignSelf="center" size="lg" name={streamer} src={avatar}>
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              </Avatar>
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
        <Avatar alignSelf="center" size="lg" name={streamer} src={avatar}>
          <AvatarBadge boxSize="1.25em" bg="red.500" />
        </Avatar>
      )}
      <ModalWindow isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default OnlineChecker
