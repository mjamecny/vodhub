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
  CopyIcon,
  DeleteIcon,
  CalendarIcon,
  RepeatClockIcon,
} from '@chakra-ui/icons'

import { setClipModalVideo, useRemoveClipMutation } from '../store'
import ModalWindow from './ModalWindow'
import Share from './Share'
import { changeDateFormat } from '../utils'

import { useAuthHeader } from 'react-auth-kit'

const FavClipItem = ({ clips }) => {
  const authHeader = useAuthHeader()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [removeClip] = useRemoveClipMutation()

  const handleRemoveClip = async (id) => {
    await removeClip({ id, token: authHeader() })
    toast({
      description: 'Removed from your favorites',
      status: 'info',
      duration: 3000,
      position: 'top',
      isClosable: false,
    })
  }

  const handleCopyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
    toast({
      description: 'URL copied to clipboard',
      status: 'success',
      duration: 3000,
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
                  onClick={() => handleRemoveClip(id)}
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
      <ModalWindow isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default FavClipItem
