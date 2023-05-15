import { SimpleGrid, Box } from '@chakra-ui/react'

import VodsSpinner from './VodsSpinner'
import ClipsListItem from './ClipsListItem'
import NoContent from './NoContent'

import { useGetClipsByUserIdQuery } from '../store'

import { useParams } from 'react-router-dom'

const ClipsList = () => {
  const { userId } = useParams()
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
      ) : isFetching ? (
        <VodsSpinner />
      ) : (
        <>
          {clips.length === 0 ? (
            <NoContent msg="Sorry, it looks like there are no clips available for this streamer at the moment. Please check back later or try again with a different streamer." />
          ) : (
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
              spacing="1rem"
              p={{ base: '1rem', sm: '2.5rem' }}
            >
              <ClipsListItem clips={clips} />
            </SimpleGrid>
          )}
        </>
      )}
    </Box>
  )
}
export default ClipsList
