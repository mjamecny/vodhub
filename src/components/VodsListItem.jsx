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
import { changeImageSize, changeDateFormat } from '../utils'

import { useDispatch, useSelector } from 'react-redux'
import { added, setVodModalVideo } from '../store'
import { useEffect } from 'react'

const VodsListItem = ({ vods }) => {
  const favVods = useSelector((state) => state.fav.favs.vods)
  const toast = useToast()
  const dispatch = useDispatch()
  const { onOpen, onClose, isOpen } = useDisclosure()

  const handleAddFav = (vod) => {
    const newVod = { ...vod, isVod: true }
    dispatch(added(newVod))
    toast({
      description: 'VOD added to your favorites',
      status: 'success',
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

  useEffect(() => {
    localStorage.setItem('vods', JSON.stringify(favVods))
  }, [favVods])

  const renderedVods = vods.map((vod) => {
    const { id, thumbnail_url, title, published_at, duration, url } = vod
    const final_src = changeImageSize(thumbnail_url, '640x360')
    const [month, day, year] = changeDateFormat(published_at)

    return (
      <Card key={id}>
        <CardBody
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap=".5rem"
        >
          <Image
            src={final_src}
            fallbackSrc="https://via.placeholder.com/640x360"
            borderRadius="lg"
          />
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
                isDisabled={favVods.find((favVod) => favVod.id === vod.id)}
                onClick={() => handleAddFav(vod)}
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
              <Text>{duration}</Text>
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
      {renderedVods}
      <ModalWindow isOpen={isOpen} onClose={onClose} title="VOD" />
    </>
  )
}
export default VodsListItem
