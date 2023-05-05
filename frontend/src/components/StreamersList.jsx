import { SimpleGrid, Box, Center, Spinner } from '@chakra-ui/react'

import { useGetUsersQuery } from '../store'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

import NoContent from './NoContent'
import StreamersListItem from './StreamersListItem'

const StreamersList = () => {
  const { searchedUsername } = useSelector((state) => state.app)
  const { streamers, isFetching } = useGetUsersQuery(searchedUsername, {
    skip: !searchedUsername,
    selectFromResult: ({ data, isFetching }) => {
      return {
        streamers: data?.data || [],
        isFetching,
      }
    },
  })

  useEffect(() => {
    localStorage.setItem('streamers', JSON.stringify(streamers))
  }, [streamers])

  return (
    <Box flex="1">
      {!searchedUsername ? (
        <NoContent
          msg="There are nothing here yet. Try searching for a streamer and see if they
        have any VODs."
        />
      ) : isFetching ? (
        <Center height="75vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
          spacing="1rem"
          p={{ base: '1rem', sm: '2.5rem' }}
        >
          <StreamersListItem streamers={streamers} />
        </SimpleGrid>
      )}
    </Box>
  )
}
export default StreamersList
