import {
  Flex,
  Text,
  Center,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Heading,
  CardFooter,
  IconButton,
  useToast,
  Button,
  useDisclosure,
  Box,
  Tag,
  Popover,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react'

import {
  CopyIcon,
  DeleteIcon,
  CalendarIcon,
  RepeatClockIcon,
} from '@chakra-ui/icons'

import {
  removed,
  removedAll,
  setVodModalVideo,
  setClipModalVideo,
} from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import NoContent from './NoContent'
import ModalWindow from './ModalWindow'
import Share from './Share'
import UserDetails from './UserDetails'

const FavsList = () => {
  const favs = useSelector((state) => state.fav.favs)
  const dispatch = useDispatch()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const changeImageSize = (url, size) => {
    return url.replace(/%{width}x%{height}/g, size)
  }

  const changeDateFormat = (date) => {
    const newDate = new Date(date)
    return [newDate.getMonth(), newDate.getDate(), newDate.getFullYear()]
  }

  const handleRemoveFav = (id) => {
    dispatch(removed(id))
    toast({
      description: 'Removed from your favorites',
      status: 'info',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleDeleteAllFavs = () => {
    dispatch(removedAll())
    toast({
      description: 'Your favorites are empty now',
      status: 'info',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleCopyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
    toast({
      description: 'URL copied to clipboard',
      status: 'success',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleOpenModal = (fav) => {
    const { tag, id } = fav
    onOpen()
    if (tag === 'vod') dispatch(setVodModalVideo(id))
    if (tag === 'clip') dispatch(setClipModalVideo(id))
  }

  useEffect(() => {
    localStorage.setItem('favs', JSON.stringify(favs))
  }, [favs])

  return (
    <>
      {favs.length === 0 ? (
        <NoContent
          msg="Do not have any favorite videos saved yet? No problem! Just browse
        selection of videos from any Twitch streamer and click the plus button
        on any video you want to save for later."
        />
      ) : (
        <Box flex="1">
          <Center mt="2rem">
            <Button size="md" alignSelf="center" onClick={handleDeleteAllFavs}>
              Delete All
            </Button>
          </Center>
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
            spacing="1rem"
            p={{ base: '1rem', sm: '2.5rem' }}
          >
            {favs.map((fav) => {
              let date
              if (fav.tag === 'vod') {
                date = fav.published_at
              }
              date = fav.created_at

              const {
                id,
                thumbnail_url,
                title,
                duration,
                url,
                user_login,
                user_id,
                tag,
              } = fav
              const final_src = changeImageSize(thumbnail_url, '1280x720')
              const [month, day, year] = changeDateFormat(date)

              return (
                <Card key={id}>
                  <Center mt="1rem">
                    {tag === 'vod' ? (
                      <Tag size="md" variant="solid" colorScheme="red">
                        VOD
                      </Tag>
                    ) : (
                      <Tag size="md" variant="solid" colorScheme="green">
                        CLIP
                      </Tag>
                    )}
                  </Center>
                  <CardBody>
                    <Image
                      src={final_src}
                      fallbackSrc="https://via.placeholder.com/1280x720"
                      borderRadius="lg"
                    />
                    <Flex
                      flexDirection="column"
                      gap="2rem"
                      mt="1rem"
                      height="150px"
                      justify="space-between"
                    >
                      <Heading
                        as="h2"
                        size="sm"
                        mt="1rem"
                        cursor="pointer"
                        transition={'all 0.3s'}
                        _hover={{ color: 'red.500' }}
                        onClick={() => handleOpenModal(fav)}
                      >
                        {title}
                      </Heading>
                      <Flex justify="space-between" align="center">
                        <Flex justify="center" align="center" gap="0.5rem">
                          <CalendarIcon />
                          <Text>{`${day}/${month + 1}/${year}`}</Text>
                        </Flex>
                        <Flex gap="0.5rem">
                          <IconButton
                            onClick={() => handleRemoveFav(id)}
                            aria-label="Remove from favorites"
                            icon={<DeleteIcon />}
                          />
                          <IconButton
                            onClick={() => handleCopyToClipboard(url)}
                            aria-label="Copy to clipboard"
                            icon={<CopyIcon />}
                          />
                        </Flex>

                        <Flex justify="center" align="center" gap="0.5rem">
                          <RepeatClockIcon />
                          <Text>{duration}</Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </CardBody>
                  <CardFooter
                    flexDirection="column"
                    justify="space-between"
                    align="center"
                    flexWrap="wrap"
                  >
                    <Share url={url} />
                    <Popover>
                      <PopoverTrigger>
                        <Text
                          mb="1rem"
                          href="#"
                          alignSelf="center"
                          cursor="pointer"
                        >
                          <Tooltip hasArrow label="Show details">
                            {user_login}
                          </Tooltip>
                        </Text>
                      </PopoverTrigger>
                      <UserDetails user_login={user_login} user_id={user_id} />
                    </Popover>
                  </CardFooter>
                </Card>
              )
            })}
          </SimpleGrid>
        </Box>
      )}
      <ModalWindow isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default FavsList
