import {
  Flex,
  Text,
  Card,
  CardBody,
  Image,
  Heading,
  CardFooter,
  IconButton,
  useToast,
  useDisclosure,
} from '@chakra-ui/react'

import {
  AddIcon,
  CopyIcon,
  CalendarIcon,
  RepeatClockIcon,
} from '@chakra-ui/icons'

import ModalWindow from './ModalWindow'
import Share from './Share'

import { useDispatch, useSelector } from 'react-redux'
import { added, setClipModalVideo } from '../store'
import { changeDateFormat } from '../utils'

const ClipsListItem = ({ clips }) => {
  const favClips = useSelector((state) => state.fav.favs.clips)
  const toast = useToast()
  const dispatch = useDispatch()
  const { onOpen, onClose, isOpen } = useDisclosure()

  const handleAddFav = (clip) => {
    const newClip = { ...clip, isClip: true }
    dispatch(added(newClip))
    toast({
      description: 'Clip added to your favorites',
      status: 'success',
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
    dispatch(setClipModalVideo(id))
  }

  const renderedClips = clips.map((clip) => {
    const { id, thumbnail_url, title, created_at, duration, url } = clip
    const [month, day, year] = changeDateFormat(created_at)

    return (
      <Card key={id}>
        <CardBody>
          <Image
            src={thumbnail_url}
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
                  isDisabled={favClips.find(
                    (favClip) => favClip.id === clip.id
                  )}
                  onClick={() => handleAddFav(clip)}
                  aria-label="Add to favorites"
                  icon={<AddIcon />}
                />
                <IconButton
                  onClick={() => handleCopyToClipboard(url)}
                  aria-label="Copy to clipboard"
                  icon={<CopyIcon />}
                />
              </Flex>
              <Flex justify="center" align="center" gap="0.5rem">
                <RepeatClockIcon />
                <Text>{Math.floor(duration)}s</Text>
              </Flex>
            </Flex>
          </Flex>
        </CardBody>
        <CardFooter justify="center" align="center" flexWrap="wrap">
          <Share url={url} />
        </CardFooter>
      </Card>
    )
  })
  return (
    <>
      {renderedClips}
      <ModalWindow isOpen={isOpen} onClose={onClose} title="CLIP" />
    </>
  )
}
export default ClipsListItem
