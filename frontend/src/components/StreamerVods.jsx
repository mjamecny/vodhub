import {
  SimpleGrid,
  Box,
  FormControl,
  Center,
  InputGroup,
  Input,
} from '@chakra-ui/react'

import VodsSpinner from './VodsSpinner'
import VodsListItem from './VodsListItem'
import NoContent from './NoContent'

import { useGetVideosByUserIdQuery } from '../store'

import { useParams } from 'react-router-dom'

import { useEffect, useState } from 'react'

const StreamerVods = () => {
  const [query, setQuery] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const [filteredVods, setFilteredVods] = useState([])
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

  useEffect(() => {
    setIsFiltering(true)
    const filtered = vods.filter((vod) =>
      vod.title.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredVods(filtered)
    if (!query) {
      setIsFiltering(false)
    }
  }, [query])

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
        <>
          {vods.length === 0 ? (
            <NoContent msg="Sorry, it looks like there are no VODs available for this streamer at the moment. Please check back later or try again with a different streamer." />
          ) : (
            <>
              <FormControl mt="2rem">
                <Center flexDirection={{ base: 'column', md: 'row' }}>
                  <InputGroup
                    w={{ base: '90%', md: '50%' }}
                    size={{ base: 'lg' }}
                  >
                    <Input
                      placeholder="Search by title"
                      name="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </InputGroup>
                </Center>
              </FormControl>
              {isFiltering ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
                  spacing="1rem"
                  px={{ base: '1rem', sm: '2.5rem' }}
                  pt=".5rem"
                >
                  <VodsListItem vods={filteredVods} />
                </SimpleGrid>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
                  spacing="1rem"
                  px={{ base: '1rem', sm: '2.5rem' }}
                  pt=".5rem"
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

export default StreamerVods
