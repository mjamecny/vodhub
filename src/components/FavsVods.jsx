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
} from '@chakra-ui/react'

import {
  CopyIcon,
  DeleteIcon,
  CalendarIcon,
  RepeatClockIcon,
} from '@chakra-ui/icons'

import { removedVod, removedAllVods, setVodModalVideo } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import NoContent from './NoContent'
import ModalWindow from './ModalWindow'
import Share from './Share'

const FavsVods = () => {
  const { vods } = useSelector((state) => state.fav.favs)
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

  const handleRemoveVod = (id) => {
    dispatch(removedVod(id))
    toast({
      description: 'Removed from your favorites',
      status: 'info',
      duration: 5000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleDeleteAllVods = () => {
    dispatch(removedAllVods())
    toast({
      description: 'Your favorites VODs are empty now',
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

  const handleOpenModal = (id) => {
    onOpen()
    dispatch(setVodModalVideo(id))
  }

  useEffect(() => {
    localStorage.setItem('vods', JSON.stringify(vods))
  }, [vods])

  return (
    <>
      <Box flex="1">
        <Center mt="2rem" gap="1rem">
          <NavLink
            to="/favorites/vods"
            className={({ isActive }) =>
              isActive ? 'activeLink' : 'nonactiveLink'
            }
          >
            <Button size="md">Vods</Button>
          </NavLink>
          <NavLink
            to="/favorites/clips"
            className={({ isActive }) =>
              isActive ? 'activeLink' : 'nonactiveLink'
            }
          >
            <Button size="md">Clips</Button>
          </NavLink>
          <NavLink
            to="/favorites/streamers"
            className={({ isActive }) =>
              isActive ? 'activeLink' : 'nonactiveLink'
            }
          >
            <Button size="md">Streamers</Button>
          </NavLink>
        </Center>
        {vods.length === 0 ? (
          <NoContent
            msg="Do not have any favorite VODs saved yet? No problem! Just browse
          selection of VODs from any Twitch streamer and click the plus button
          on any VOD you want to save for later."
          />
        ) : (
          <>
            <Center mt="2rem">
              <Button
                size="sm"
                alignSelf="center"
                onClick={handleDeleteAllVods}
              >
                Delete All
              </Button>
            </Center>{' '}
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, '2xl': 4 }}
              spacing="1rem"
              px={{ base: '1rem', sm: '2.5rem' }}
              pt="0.5rem"
            >
              {vods.map((vod) => {
                const {
                  id,
                  thumbnail_url,
                  title,
                  duration,
                  url,
                  user_login,
                  user_id,
                  published_at,
                } = vod
                const final_src = changeImageSize(thumbnail_url, '1280x720')
                const [month, day, year] = changeDateFormat(published_at)

                return (
                  <Card key={id}>
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
                          onClick={() => handleOpenModal(id)}
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
                              onClick={() => handleRemoveVod(id)}
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
                    </CardFooter>
                  </Card>
                )
              })}
            </SimpleGrid>
          </>
        )}
      </Box>

      <ModalWindow isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default FavsVods
