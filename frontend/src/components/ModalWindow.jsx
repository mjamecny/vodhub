import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react'

import { useSelector } from 'react-redux'

const ModalWindow = ({ isOpen, onClose, title }) => {
  const modalVideo = useSelector((state) => state.app.modalVideo)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <iframe
            title="video"
            src={modalVideo}
            height="800"
            width="100%"
            allowFullScreen
          ></iframe>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default ModalWindow
