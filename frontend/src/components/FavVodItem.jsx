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

import { setVodModalVideo, useRemoveMutation } from '../store'

import { changeImageSize, changeDateFormat } from '../utils'
import Share from './Share'
import ModalWindow from './ModalWindow'

const FavVodItem = ({ vods }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [remove] = useRemoveMutation()

  const handleRemoveVod = async (id) => {
    await remove({ id, token: authHeader() })
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
    dispatch(setVodModalVideo(id))
  }

  const renderedVods = vods.map((vod) => {
    const { id, thumbnail_url, title, duration, url, published_at } = vod
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
  })
  return (
    <>
      {renderedVods}
      <ModalWindow isOpen={isOpen} onClose={onClose} title="VOD" />
    </>
  )
}
export default FavVodItem
