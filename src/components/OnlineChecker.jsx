import ModalWindow from './ModalWindow'

import { Badge, Link, Tooltip, Spinner, useDisclosure } from '@chakra-ui/react'

import { useGetIsStreamerOnlineQuery, setStreamModalVideo } from '../store'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'

const OnlineChecker = ({ streamer }) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const dispatch = useDispatch()
  const [streamStatus, setStreamStatus] = useState(false)
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
        <Tooltip hasArrow label="Open stream">
          <Link onClick={handleOpenModal}>
            <Badge fontSize="lg" colorScheme="green">
              {streamer} is online
            </Badge>
          </Link>
        </Tooltip>
      ) : (
        <Badge fontSize="lg" colorScheme="red">
          {streamer} is offline
        </Badge>
      )}
      <ModalWindow isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default OnlineChecker
