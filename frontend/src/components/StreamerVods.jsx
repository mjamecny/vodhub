import { SimpleGrid, Box } from '@chakra-ui/react'

import VodsSpinner from './VodsSpinner'
import VodsListItem from './VodsListItem'
import NoContent from './NoContent'

import { useGetVideosByUserIdQuery } from '../store'

import { useParams } from 'react-router-dom'

import { useIsAuthenticated } from 'react-auth-kit'
import { useSignOut } from 'react-auth-kit'

const StreamerVods = () => {
  // const isAuthenticated = useIsAuthenticated()
  // const signOut = useSignOut()
  const { userId } = useParams()
  const { vods, isFetching, isError } = useGetVideosByUserIdQuery(userId, {
    skip: !userId,
    selectFromResult: ({ data, isFetching, isError }) => {
      return {
        vods: data?.data || [],
        isFetching,
        isError,
      }
    },
  })

  // console.log(vods)

  // if (isError) signOut()

  return (
    <Box flex="1">
      {!userId ? (
        <NoContent
          msg="There are nothing here yet. Try searching for a streamer and see if they
        have any VODs."
        />
      ) : isFetching ? (
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

export default StreamerVods
