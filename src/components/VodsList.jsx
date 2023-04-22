import { SimpleGrid, Box } from '@chakra-ui/react'

import VodsSpinner from './VodsSpinner'
import OnlineChecker from './OnlineChecker'
import VodsListItem from './VodsListItem'
import NoContent from './NoContent'

import { useSelector } from 'react-redux'
import { useGetVideosByUserIdQuery } from '../store'

const VodsList = () => {
  const userId = useSelector((state) => state.app.userId)
  const { vods, isFetching } = useGetVideosByUserIdQuery(userId, {
    skip: !userId,
    selectFromResult: ({ data, isFetching }) => {
      return {
        vods: data?.data || [],
        isFetching,
      }
    },
  })

  return (
    <Box flex="1">
      {!userId ? (
        <NoContent
          msg="There are nothing here yet. Try searching for a streamer and see if they
        have any VODs."
        />
      ) : (
        <OnlineChecker />
      )}
      {isFetching ? (
        <VodsSpinner />
      ) : (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
          spacing="1rem"
          p={{ base: '1rem', sm: '2.5rem' }}
        >
          <VodsListItem vods={vods} />
        </SimpleGrid>
      )}
    </Box>
  )
}

export default VodsList
