import {
  SimpleGrid,
  Box,
  Flex,
  IconButton,
  useToast,
  Center,
  Spinner,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import OnlineChecker from './OnlineChecker'
import ClipsListItem from './ClipsListItem'
import NoContent from './NoContent'
import FormFilter from './FormFilter'

import { useSelector } from 'react-redux'
import {
  useGetClipsByUserIdQuery,
  useGetUserByNameQuery,
  useAddStreamerMutation,
  useGetStreamersQuery,
} from '../store'

import { useAuthHeader } from 'react-auth-kit'

// import { useState } from 'react'

const ClipsList = () => {
  // const [query, setQuery] = useState('')
  // const [isFiltering, setIsFiltering] = useState(false)
  // const [filteredClips, setFilteredClips] = useState([])
  const authHeader = useAuthHeader()
  const toast = useToast()
  const { userId, searchedUsername, isFiltering, filtered } = useSelector(
    (state) => state.app
  )

  const { clips, isFetching } = useGetClipsByUserIdQuery(userId, {
    skip: !userId,
    selectFromResult: ({ data, isFetching }) => {
      return {
        clips: data?.data || [],
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

  // useEffect(() => {
  //   setIsFiltering(true)
  //   const filtered = clips.filter((clip) =>
  //     clip.title.toLowerCase().includes(query.toLowerCase())
  //   )
  //   setFilteredClips(filtered)
  //   if (!query) {
  //     setIsFiltering(false)
  //   }
  // }, [query])

  return (
    <Box flex="1">
      {!userId ? (
        <NoContent
          msg="There are nothing here yet. Try searching for a streamer and see if they
        have any clips."
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
              size="sm"
              icon={<AddIcon />}
              onClick={() => handleAddStreamer(streamer.id)}
              ml="1rem"
            />
          </Flex>

          {clips.length === 0 ? (
            <NoContent msg="Sorry, it looks like there are no clips available for this streamer at the moment. Please check back later or try again with a different streamer." />
          ) : (
            <>
              {/* <FormControl mt="1rem">
                <Center flexDirection={{ base: 'column', md: 'row' }}>
                  <InputGroup
                    w={{ base: '90%', md: '50%' }}
                    size={{ base: 'lg' }}
                    gap="1rem"
                  >
                    <Input
                      placeholder="Filter by title"
                      name="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </InputGroup>
                </Center>
              </FormControl> */}
              <FormFilter data={clips} />
              {isFiltering ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
                  spacing="1rem"
                  px={{ base: '1rem', sm: '2.5rem' }}
                  mt=".5rem"
                >
                  <ClipsListItem clips={filtered} />
                </SimpleGrid>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
                  spacing="1rem"
                  px={{ base: '1rem', sm: '2.5rem' }}
                  mt=".5rem"
                >
                  <ClipsListItem clips={clips} />
                </SimpleGrid>
              )}
            </>
          )}
        </>
      )}
    </Box>
  )
}
export default ClipsList
