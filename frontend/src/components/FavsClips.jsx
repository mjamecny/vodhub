import { SimpleGrid, useToast, Box, Spinner, Center } from '@chakra-ui/react'

import {
  useGetClipsQuery,
  useRemoveAllClipsMutation,
  useLazyGetClipsByClipIdQuery,
  setClips,
} from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import NoContent from './NoContent'
import DeleteAllButton from './DeleteAllButton'
import FavClipItem from './FavClipItem'
import FormFilter from './FormFilter'

import { useAuthHeader } from 'react-auth-kit'

const FavsClips = () => {
  const authHeader = useAuthHeader()
  const dispatch = useDispatch()
  const toast = useToast()

  const { clips, isFiltering, filtered } = useSelector((state) => state.app)
  const { clipIds, isFetching } = useGetClipsQuery(
    { token: authHeader() },
    {
      skip: !authHeader(),
      selectFromResult: ({ data, isFetching }) => {
        return {
          clipIds: data?.clips || [],
          isFetching,
        }
      },
    }
  )

  const [removeAllClips] = useRemoveAllClipsMutation()
  const [getClipsByClipId] = useLazyGetClipsByClipIdQuery()

  const handleDeleteAllClips = async () => {
    await removeAllClips({ token: authHeader() })
    toast({
      description: 'Your favorites clips are empty now',
      status: 'info',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  useEffect(() => {
    const getClips = async () => {
      if (!clipIds || clipIds.length === 0) return
      const res = await getClipsByClipId(clipIds)
      dispatch(setClips(res.data?.data))
    }

    getClips()
  }, [clipIds])

  return (
    <>
      <Box flex="1">
        {isFetching ? (
          <Center height="75vh">
            <Spinner size="xl" />
          </Center>
        ) : clipIds.length === 0 ? (
          <NoContent
            msg="Do not have any favorite clips saved yet? No problem! Just browse
            selection of clips from any Twitch streamer and click the plus button
            on any clip you want to save for later."
          />
        ) : (
          <>
            <DeleteAllButton handleDelete={handleDeleteAllClips} />
            <FormFilter data={clips} />
            {isFiltering ? (
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
                spacing="1rem"
                px={{ base: '1rem', sm: '2.5rem' }}
                pt="0.5rem"
              >
                <FavClipItem clips={filtered} />
              </SimpleGrid>
            ) : (
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
                spacing="1rem"
                px={{ base: '1rem', sm: '2.5rem' }}
                pt="0.5rem"
              >
                <FavClipItem clips={clips} />
              </SimpleGrid>
            )}
          </>
        )}
      </Box>
    </>
  )
}
export default FavsClips
