import { SimpleGrid, Box, Flex, IconButton, useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import VodsSpinner from './VodsSpinner'
import OnlineChecker from './OnlineChecker'
import ClipsListItem from './ClipsListItem'
import NoContent from './NoContent'

import { useSelector, useDispatch } from 'react-redux'
import {
  useGetClipsByUserIdQuery,
  useGetUserByNameQuery,
  added,
} from '../store'

const ClipsList = () => {
  const dispatch = useDispatch()
  const toast = useToast()
  const { userId, searchedUsername } = useSelector((state) => state.app)
  const { streamers } = useSelector((state) => state.fav.favs)
  const { clips, isFetching } = useGetClipsByUserIdQuery(userId, {
    skip: !userId,
    selectFromResult: ({ data, isFetching }) => {
      return {
        clips: data?.data || [],
        isFetching,
      }
    },
  })
  const { streamer } = useGetUserByNameQuery(searchedUsername, {
    skip: !searchedUsername,
    selectFromResult: ({ data }) => {
      return {
        streamer: data?.data[0] || {},
      }
    },
  })

  const handleAddStreamer = (streamer) => {
    const newStreamer = { ...streamer, isStreamer: true }
    dispatch(added(newStreamer))

    toast({
      description: 'Streamer added to your favorites',
      status: 'success',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }
  return (
    <Box flex="1">
      {!userId ? (
        <NoContent
          msg="There are nothing here yet. Try searching for a streamer and see if they
        have any clips."
        />
      ) : isFetching ? (
        <VodsSpinner />
      ) : (
        <>
          <Flex justify="center" align="center" mt="2rem">
            <OnlineChecker streamer={searchedUsername} />
            <IconButton
              isDisabled={streamers.find((s) => s.id === userId)}
              size="sm"
              icon={<AddIcon />}
              onClick={() => handleAddStreamer(streamer)}
              ml="1rem"
            />
          </Flex>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
            spacing="1rem"
            p={{ base: '1rem', sm: '2.5rem' }}
          >
            <ClipsListItem clips={clips} />
          </SimpleGrid>
        </>
      )}
    </Box>
  )
}
export default ClipsList
