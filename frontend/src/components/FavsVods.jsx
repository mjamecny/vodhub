import { SimpleGrid, useToast, Box, Spinner, Center } from '@chakra-ui/react'

import {
  useGetVodsQuery,
  useLazyGetVideosByVideoIdQuery,
  useRemoveAllMutation,
  setVods,
} from '../store'

import { useDispatch, useSelector } from 'react-redux'

import NoContent from './NoContent'
import DeleteAllButton from './DeleteAllButton'
import FavVodItem from './FavVodItem'
import FormFilter from './FormFilter'
import { useAuthHeader } from 'react-auth-kit'
import { useEffect } from 'react'

const FavsVods = () => {
  const authHeader = useAuthHeader()
  const dispatch = useDispatch()
  const toast = useToast()
  const { vods, isFiltering, filtered } = useSelector((state) => state.app)

  const { vodIds, isFetching } = useGetVodsQuery(
    { token: authHeader() },
    {
      skip: !authHeader(),
      selectFromResult: ({ data, isFetching }) => {
        return {
          vodIds: data?.vods || [],
          isFetching,
        }
      },
    }
  )

  const [getVideosByVideoId] = useLazyGetVideosByVideoIdQuery()
  const [removeAll] = useRemoveAllMutation()

  const handleDeleteAllVods = async () => {
    await removeAll({ token: authHeader() })
    toast({
      description: 'Your favorites VODs are empty now',
      status: 'info',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  useEffect(() => {
    const getVods = async () => {
      if (!vodIds || vodIds.length === 0) return
      const res = await getVideosByVideoId(vodIds)
      dispatch(setVods(res.data?.data))
    }

    getVods()
  }, [vodIds])

  return (
    <>
      <Box flex="1">
        {isFetching ? (
          <Center height="75vh">
            <Spinner size="xl" />
          </Center>
        ) : vodIds.length === 0 ? (
          <NoContent
            msg="Do not have any favorite VODs saved yet? No problem! Just browse
          selection of VODs from any Twitch streamer and click the plus button
          on any VOD you want to save for later."
          />
        ) : (
          <>
            <DeleteAllButton handleDelete={handleDeleteAllVods} />
            <FormFilter data={vods} />
            {isFiltering ? (
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
                spacing="1rem"
                px={{ base: '1rem', sm: '2.5rem' }}
                pt="0.5rem"
              >
                <FavVodItem vods={filtered} />
              </SimpleGrid>
            ) : (
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
                spacing="1rem"
                px={{ base: '1rem', sm: '2.5rem' }}
                pt="0.5rem"
              >
                <FavVodItem vods={vods} />
              </SimpleGrid>
            )}
          </>
        )}
      </Box>
    </>
  )
}
export default FavsVods
