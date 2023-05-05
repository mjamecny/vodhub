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
import { useEffect, useRef } from 'react'

const OnlineChecker = ({ streamer, id }) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const dispatch = useDispatch()
  const { stream, isFetching } = useGetIsStreamerOnlineQuery(streamer, {
    // pollingInterval: 300000, // re-fetch every 5 minutes (300000)
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

  // const webSocketRef = useRef(null)

  // useEffect(() => {
  //   const webSocket = new WebSocket('wss://eventsub.wss.twitch.tv/ws')

  //   webSocket.onopen = () => {
  //     console.log('WebSocket connection is open')
  //     webSocket.send(
  //       JSON.stringify({
  //         type: 'stream.online',
  //         version: '1',
  //         condition: {
  //           broadcaster_user_id: id,
  //         },
  //         transport: {
  //           method: 'webhook',
  //         },
  //       })
  //     )
  //   }

  //   webSocket.onmessage = (event) => {
  //     const data = JSON.parse(event.data)
  //     console.log(data)
  //     if (data.type === 'MESSAGE') {
  //       const streamOnlineEvent = JSON.parse(data.message.data)
  //       console.log(streamOnlineEvent)
  //       if (streamOnlineEvent.broadcaster_user_login === streamer) {
  //         console.log(`${streamer} is now streaming!`)
  //         // Update your component state or dispatch an action here
  //       }
  //     }
  //   }

  //   webSocketRef.current = webSocket

  //   return () => {
  //     console.log('WebSocket connection is closing')
  //     webSocket.close()
  //   }
  // }, [streamer])

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
