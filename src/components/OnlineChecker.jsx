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

import { useGetIsStreamerOnlineQuery, setStreamModalVideo } from '../store'
import { convertDurationToMin } from '../utils'
import { useDispatch } from 'react-redux'
// import { useState, useEffect } from 'react'

const OnlineChecker = ({ streamer }) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const dispatch = useDispatch()
  // const [streamStatus, setStreamStatus] = useState(false)
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

  let durationMin

  if (stream.length !== 0) {
    durationMin = convertDurationToMin(stream[0].started_at)
  }

  // useEffect(() => {
  //   if (!isFetching && Object.keys(stream).length !== 0 && !streamStatus) {
  //     setStreamStatus(true)
  //     if (Notification.permission === 'granted') {
  //       const notification = new Notification(`${streamer} is now streaming!`, {
  //         body: 'Click to watch the stream.',
  //       })
  //       notification.onclick = handleOpenModal
  //     } else if (Notification.permission !== 'denied') {
  //       Notification.requestPermission().then((permission) => {
  //         if (permission === 'granted') {
  //           const notification = new Notification(
  //             `${streamer} is now streaming!`,
  //             {
  //               body: 'Click to watch the stream.',
  //             }
  //           )
  //           notification.onclick = handleOpenModal
  //         }
  //       })
  //     }
  //   }
  // }, [isFetching, stream, streamStatus, streamer])

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
                  {durationMin.toFixed(0)} mins
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
