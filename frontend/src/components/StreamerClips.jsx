import {
  SimpleGrid,
  Box,
  FormControl,
  InputGroup,
  Input,
  Center,
  Button,
} from '@chakra-ui/react'

import VodsSpinner from './VodsSpinner'
import ClipsListItem from './ClipsListItem'
import NoContent from './NoContent'

import { useGetClipsByUserIdQuery } from '../store'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

const ClipsList = () => {
  const [query, setQuery] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const [filteredClips, setFilteredClips] = useState([])
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

  useEffect(() => {
    setIsFiltering(true)
    const filtered = clips.filter((clip) =>
      clip.title.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredClips(filtered)
    if (!query) {
      setIsFiltering(false)
    }
  }, [query])

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
            <>
              <FormControl mt="2rem">
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
                    <Button
                      onClick={() => {
                        setIsFiltering(false)
                        setQuery('')
                      }}
                    >
                      Reset
                    </Button>
                  </InputGroup>
                </Center>
              </FormControl>
              {isFiltering ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
                  spacing="1rem"
                  px={{ base: '1rem', sm: '2.5rem' }}
                  mt=".5rem"
                >
                  <ClipsListItem clips={filteredClips} />
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
