import { Center } from '@chakra-ui/react'
import {
  FacebookShareButton,
  PocketShareButton,
  TwitterShareButton,
  VKShareButton,
  WhatsappShareButton,
  FacebookIcon,
  PocketIcon,
  TwitterIcon,
  VKIcon,
  WhatsappIcon,
} from 'react-share'

const Share = ({ url }) => {
  return (
    <Center mb="1rem" gap="0.5rem">
      <TwitterShareButton url={url}>
        <TwitterIcon size={30} />
      </TwitterShareButton>
      <FacebookShareButton url={url}>
        <FacebookIcon size={30} />
      </FacebookShareButton>
      <WhatsappShareButton url={url}>
        <WhatsappIcon size={30} />
      </WhatsappShareButton>
      <PocketShareButton url={url}>
        <PocketIcon size={30} />
      </PocketShareButton>
      <VKShareButton url={url}>
        <VKIcon size={30} />
      </VKShareButton>
    </Center>
  )
}
export default Share
