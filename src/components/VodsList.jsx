import {
  SimpleGrid,
  Box,
  IconButton,
  Flex,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import OnlineChecker from './OnlineChecker'
import VodsListItem from './VodsListItem'
import NoContent from './NoContent'

import { useSelector, useDispatch } from 'react-redux'
import {
  useGetVideosByUserIdQuery,
  useGetUserByNameQuery,
  added,
} from '../store'
import { useEffect } from 'react'

const VodsList = () => {
  const dispatch = useDispatch()
  const toast = useToast()
  const { streamers } = useSelector((state) => state.fav.favs)
  const { userId, searchedUsername } = useSelector((state) => state.app)
  const { vods, isFetching } = useGetVideosByUserIdQuery(userId, {
    skip: !userId,
    selectFromResult: ({ data, isFetching }) => {
      return {
        vods: data?.data || [],
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
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  useEffect(() => {
    localStorage.setItem('streamers', JSON.stringify(streamers))
  }, [streamers])

  return (
    <Box flex="1">
      {!userId ? (
        <NoContent
          msg="There are nothing here yet. Try searching for a streamer and see if they
        have any VODs."
        />
      ) : isFetching ? (
        <Center height="75vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <>
          <Flex justify="center" align="center" mt="2rem">
            <OnlineChecker streamer={searchedUsername} />
            <IconButton
              isDisabled={streamers.find((s) => s.id === userId)}
              size={{ base: 'sm', md: 'md', lg: 'lg' }}
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
            <VodsListItem vods={vods} />
          </SimpleGrid>
        </>
      )}
    </Box>
  )
}

export default VodsList
