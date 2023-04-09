import { Flex, Badge, Link, Tooltip } from '@chakra-ui/react'

const OnlineChecker = ({ onOpen, dispatch, state }) => {
  const handleOpenModal = () => {
    onOpen()
    dispatch({
      type: 'OPEN_MODAL',
      payload: `https://player.twitch.tv/?channel=${state.searchedStreamer}${
        process.env.NODE_ENV === 'development'
          ? '&parent=localhost'
          : `&parent=${process.env.REACT_APP_URL}`
      }`,
    })
  }

  return (
    <Flex justify="center" align="center" mt="2rem">
      {Object.keys(state.stream).length !== 0 ? (
        <Tooltip hasArrow label="Open stream">
          <Link onClick={handleOpenModal}>
            <Badge fontSize="lg" colorScheme="green">
              {state.searchedStreamer} is online
            </Badge>
          </Link>
        </Tooltip>
      ) : (
        <Badge fontSize="lg" colorScheme="red">
          {state.searchedStreamer} is offline
        </Badge>
      )}
    </Flex>
  )
}

export default OnlineChecker
