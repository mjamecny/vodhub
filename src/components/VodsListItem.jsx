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
import { addedVod, setVodModalVideo } from '../store'
import { useEffect } from 'react'
import FavsVods from './FavsVods'

const VodsListItem = ({ vods }) => {
  const vodsFavs = useSelector((state) => state.fav.favs.vods)
  const toast = useToast()
  const dispatch = useDispatch()
  const { onOpen, onClose, isOpen } = useDisclosure()

  const changeImageSize = (url, size) => {
    return url.replace(/%{width}x%{height}/g, size)
  }

  const changeDateFormat = (date) => {
    const newDate = new Date(date)
    return [newDate.getMonth(), newDate.getDate(), newDate.getFullYear()]
  }

  const handleAddFav = (vod) => {
    dispatch(addedVod(vod))
    toast({
      description: 'VOD added to your favorites',
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
    dispatch(setVodModalVideo(id))
  }

  useEffect(() => {
    localStorage.setItem('vods', JSON.stringify(vodsFavs))
  }, [vodsFavs])

  const renderedVods = vods.map((vod) => {
    const { id, thumbnail_url, title, published_at, duration, url } = vod
    const final_src = changeImageSize(thumbnail_url, '1280x720')
    const [month, day, year] = changeDateFormat(published_at)

    return (
      <Card key={id} size="lg">
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
                  isDisabled={vodsFavs.find((vodFav) => vodFav.id === vod.id)}
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
          </Flex>
        </CardBody>
        <CardFooter justify="center" align="center" flexWrap="wrap">
          {' '}
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
