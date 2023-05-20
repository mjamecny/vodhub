import {
  Flex,
  Text,
  SimpleGrid,
  useToast,
  Button,
  Box,
  Center,
  Spinner,
} from '@chakra-ui/react'

import {
  useGetStreamersQuery,
  useRemoveAllStreamersMutation,
  useLazyGetStreamersByStreamerIdQuery,
  setStreamers,
  useImportStreamersMutation,
} from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import NoContent from './NoContent'
import DeleteAllButton from './DeleteAllButton'
import FavStreamerItem from './FavStreamerItem'

import { useAuthHeader, useSignOut } from 'react-auth-kit'

const FavsStreamers = () => {
  const signOut = useSignOut()
  const authHeader = useAuthHeader()
  const dispatch = useDispatch()
  const toast = useToast()

  const [importData] = useImportStreamersMutation()
  const [getStreamersByStreamerId] = useLazyGetStreamersByStreamerIdQuery()
  const [removedAllStreamers] = useRemoveAllStreamersMutation()

  const { streamers } = useSelector((state) => state.app)

  const { streamerIds, isFetching } = useGetStreamersQuery(
    { token: authHeader() },
    {
      skip: !authHeader(),
      selectFromResult: ({ data, isError, isFetching }) => {
        if (isError) signOut()
        return {
          streamerIds: data?.streamers || [],
          isFetching,
        }
      },
    }
  )

  const handleDeleteAllStreamers = async () => {
    await removedAllStreamers({ token: authHeader() })
    toast({
      description: 'Your favorites streamers are empty now',
      status: 'info',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleExport = () => {
    const jsonData = JSON.stringify(streamerIds)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'streamers.json'
    link.click()
  }

  const handleImport = (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const streamerIds = JSON.parse(event.target.result)
        const res = await importData({ streamerIds, token: authHeader() })
      } catch (error) {
        toast({
          description: 'Invalid format',
          status: 'error',
          duration: 3000,
          position: 'top',
          isClosable: false,
        })
      }
    }
    reader.readAsText(e.target.files[0])
  }

  useEffect(() => {
    const getStreamers = async () => {
      if (!streamerIds || streamerIds.length === 0) return
      const res = await getStreamersByStreamerId(streamerIds)
      dispatch(setStreamers(res.data?.data))
    }

    getStreamers()
  }, [streamerIds])

  return (
    <>
      <Box flex="1">
        {isFetching ? (
          <Center height="75vh">
            <Spinner size="xl" />
          </Center>
        ) : streamerIds.length === 0 ? (
          <>
            <Center mt="2rem" gap="1rem">
              <Text>Import streamers</Text>
              <input type="file" onChange={handleImport} />
            </Center>

            <NoContent
              msg="Do not have any favorite streamers saved yet? No problem! Just browse
            selection of videos or clips from any Twitch streamer and click the plus button to add them to your favorites or import your own JSON file."
            />
          </>
        ) : (
          <>
            <Flex justify="center" gap="1rem">
              <DeleteAllButton handleDelete={handleDeleteAllStreamers} />
              <Button mt="2rem" onClick={handleExport}>
                Export JSON
              </Button>
            </Flex>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
              spacing="1rem"
              px={{ base: '1rem', sm: '2.5rem' }}
              pt="0.5rem"
            >
              <FavStreamerItem streamers={streamers} />
            </SimpleGrid>
          </>
        )}
      </Box>
    </>
  )
}
export default FavsStreamers
