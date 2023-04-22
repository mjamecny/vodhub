import ModalWindow from './ModalWindow'

import {
  Flex,
  Badge,
  Link,
  Tooltip,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react'

import { useGetIsStreamerOnlineQuery, setStreamModalVideo } from '../store'
import { useSelector, useDispatch } from 'react-redux'

const OnlineChecker = () => {
  const searchedUsername = useSelector((state) => state.app.searchedUsername)
  const { onOpen, onClose, isOpen } = useDisclosure()
  const dispatch = useDispatch()
  const { data, isFetching, error } =
    useGetIsStreamerOnlineQuery(searchedUsername)

  const handleOpenModal = () => {
    onOpen()
    dispatch(setStreamModalVideo(searchedUsername))
  }

  return (
    <Flex justify="center" align="center" mt="2rem">
      {isFetching ? (
        <Spinner />
      ) : Object.keys(data?.data).length !== 0 ? (
        <Tooltip hasArrow label="Open stream">
          <Link onClick={handleOpenModal}>
            <Badge fontSize="lg" colorScheme="green">
              {searchedUsername} is online
            </Badge>
          </Link>
        </Tooltip>
      ) : (
        <Badge fontSize="lg" colorScheme="red">
          {searchedUsername} is offline
        </Badge>
      )}
      <ModalWindow isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}
export default OnlineChecker
