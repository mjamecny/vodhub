import { Button, Center } from '@chakra-ui/react'

const DeleteAllButton = ({ handleDelete }) => {
  return (
    <Center mt="2rem">
      <Button size="md" alignSelf="center" onClick={handleDelete}>
        Delete All
      </Button>
    </Center>
  )
}
export default DeleteAllButton
