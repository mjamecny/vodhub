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
import FormFilter from './FormFilter'

import { useSelector } from 'react-redux'
import {
  useGetVideosByUserIdQuery,
  useGetUserByNameQuery,
  useGetStreamersQuery,
  useAddStreamerMutation,
} from '../store'
import { useAuthHeader } from 'react-auth-kit'

const VodsList = () => {
  const authHeader = useAuthHeader()
  const toast = useToast()
  const { userId, searchedUsername, isFiltering, filtered } = useSelector(
    (state) => state.app
  )
  const { vods, isFetching } = useGetVideosByUserIdQuery(userId, {
    skip: !userId,
    selectFromResult: ({ data, isFetching }) => {
      return {
        vods: data?.data || [],
        isFetching,
      }
    },
  })

  const [addStreamer] = useAddStreamerMutation()

  const { streamer } = useGetUserByNameQuery(searchedUsername, {
    skip: !searchedUsername,
    selectFromResult: ({ data }) => {
      return {
        streamer: data?.data[0] || {},
      }
    },
  })

  const { streamerIds } = useGetStreamersQuery(
    { token: authHeader() },
    {
      skip: !authHeader(),
      selectFromResult: ({ data }) => {
        return {
          streamerIds: data?.streamers || [],
        }
      },
    }
  )

  const handleAddStreamer = async (id) => {
    const res = await addStreamer({ id, token: authHeader() })
    if (res.isError)
      return toast({
        description: res.error.data.message,
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: false,
      })

    toast({
      description: res.data.message,
      status: 'success',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

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
              isDisabled={streamerIds.find(
                (streamerId) => streamerId === userId
              )}
              size={{ base: 'sm' }}
              icon={<AddIcon />}
              onClick={() => handleAddStreamer(streamer.id)}
              ml="1rem"
            />
          </Flex>

          {vods.length === 0 ? (
            <NoContent msg="Sorry, it looks like there are no VODs available for this streamer at the moment. Please check back later or try again with a different streamer." />
          ) : (
            <>
              <FormFilter data={vods} />
              {isFiltering ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
                  spacing="1rem"
                  px={{ base: '1rem', sm: '2.5rem' }}
                  mt=".5rem"
                >
                  <VodsListItem vods={filtered} />
                </SimpleGrid>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
                  spacing="1rem"
                  px={{ base: '1rem', sm: '2.5rem' }}
                  mt=".5rem"
                >
                  <VodsListItem vods={vods} />
                </SimpleGrid>
              )}
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default VodsList
