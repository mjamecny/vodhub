import { SimpleGrid, Box } from '@chakra-ui/react'

import VodsSpinner from './VodsSpinner'
import OnlineChecker from './OnlineChecker'
import ClipsListItem from './ClipsListItem'
import NoContent from './NoContent'

import { useSelector } from 'react-redux'
import { useGetClipsByUserIdQuery } from '../store'

const ClipsList = () => {
  const userId = useSelector((state) => state.app.userId)
  const { clips, isFetching } = useGetClipsByUserIdQuery(userId, {
    skip: !userId,
    selectFromResult: ({ data, isFetching }) => {
      return {
        clips: data?.data || [],
        isFetching,
      }
    },
  })

  return (
    <Box flex="1">
      {!userId ? (
        <NoContent
          msg="There are nothing here yet. Try searching for a streamer and see if they
        have any clips."
        />
      ) : (
        <OnlineChecker />
      )}
      {isFetching ? (
        <VodsSpinner />
      ) : (
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
          spacing="1rem"
          p={{ base: '1rem', sm: '2.5rem' }}
        >
          <ClipsListItem clips={clips} />
        </SimpleGrid>
      )}
    </Box>
  )
}
export default ClipsList
