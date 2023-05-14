import {
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Button,
  FormControl,
  Input,
  InputRightElement,
  InputGroup,
  Flex,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Box,
} from '@chakra-ui/react'

import { DeleteIcon, EditIcon } from '@chakra-ui/icons'

import {
  useGetAppUsersQuery,
  useRemoveUserMutation,
  useUpdateUserMutation,
} from '../store'
import { useAuthHeader } from 'react-auth-kit'
import { useRef } from 'react'
import { useState } from 'react'

const Users = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const authHeader = useAuthHeader()
  const cancelRef = useRef()

  const [userId, setUserId] = useState('')
  const [editedUsername, setEditedUsername] = useState('')
  const [editedEmail, setEditedEmail] = useState('')
  const [editedId, setEditedId] = useState('')
  const [editedActive, setEditedActive] = useState('')
  const [editing, setEditing] = useState({ id: null, field: null })
  const [isEditing, setIsEditing] = useState(false)

  const [removeUser] = useRemoveUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const { data } = useGetAppUsersQuery({
    token: authHeader(),
  })

  const handleEdit = (id, field) => setEditing({ id, field })
  const handleRemoveUser = async (id) => {
    const res = await removeUser({ token: authHeader(), id })
    if (res.error) {
      toast({
        description: 'Something went wrong',
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: false,
      })
    } else {
      toast({
        description: 'User removed successfully',
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: false,
      })
    }

    onClose()
  }

  const handleOpen = (id) => {
    onOpen()
    setUserId(id)
  }

  const handleSubmitUsername = async (e) => {
    e.preventDefault()
    const res = await updateUser({
      token: authHeader(),
      id: editedId,
      body: {
        username: editedUsername,
      },
    })

    if (res.error) {
      toast({
        description: 'Something went wrong',
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: false,
      })
    } else {
      toast({
        description: 'Username edited successfully',
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: false,
      })
    }
    setIsEditing(false)
  }

  const handleSubmitEmail = async (e) => {
    e.preventDefault()
    const res = await updateUser({
      token: authHeader(),
      id: editedId,
      body: {
        email: editedEmail,
      },
    })
    if (res.error) {
      toast({
        description: 'Something went wrong',
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: false,
      })
    } else {
      toast({
        description: 'Email edited successfully',
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: false,
      })
    }

    setIsEditing(false)
  }

  const handleSubmitActive = async (e) => {
    e.preventDefault()
    const res = await updateUser({
      token: authHeader(),
      id: editedId,
      body: {
        active: editedActive,
      },
    })
    setIsEditing(false)
  }

  return (
    <Box flex="1">
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
        spacing="1rem"
        p={{ base: '1rem', sm: '2.5rem' }}
      >
        {data?.users.map((user) => {
          const { _id, username, email, role, active } = user
          return (
            <Card key={_id} size="sm">
              <CardHeader>
                <Heading size="sm" align="center">
                  {_id}
                </Heading>
              </CardHeader>
              <CardBody>
                <Flex justify="center" align="center" gap=".5rem">
                  <Text size="sm" justify="center" as="b">
                    Username:
                  </Text>
                  {isEditing &&
                  editing.id === _id &&
                  editing.field === 'username' ? (
                    <FormControl>
                      <form onSubmit={handleSubmitUsername}>
                        <InputGroup size="md">
                          <Input
                            type="text"
                            value={editedUsername}
                            onChange={(e) => setEditedUsername(e.target.value)}
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              size="sm"
                              h="1.75rem"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </form>
                    </FormControl>
                  ) : (
                    <Flex justify="center" align="center" gap="1rem">
                      {username}
                      <IconButton
                        size="sm"
                        aria-label="Edit username"
                        icon={<EditIcon />}
                        onClick={() => {
                          setEditedUsername(username)
                          handleEdit(_id, 'username')
                          setEditedId(_id)
                          setIsEditing(true)
                        }}
                      />
                    </Flex>
                  )}
                </Flex>
                <Flex justify="center" align="center" gap=".5rem">
                  <Text size="sm" justify="center" as="b">
                    Email:
                  </Text>
                  {isEditing &&
                  editing.id === _id &&
                  editing.field === 'email' ? (
                    <FormControl>
                      <form onSubmit={handleSubmitEmail}>
                        <InputGroup size="md">
                          <Input
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              size="sm"
                              h="1.75rem"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </form>
                    </FormControl>
                  ) : (
                    <Flex justify="center" align="center" gap="1rem">
                      {email}
                      <IconButton
                        size="sm"
                        aria-label="Edit email"
                        icon={<EditIcon />}
                        onClick={() => {
                          setEditedEmail(email)
                          handleEdit(_id, 'email')
                          setEditedId(_id)
                          setIsEditing(true)
                        }}
                      />
                    </Flex>
                  )}
                </Flex>
                <Flex justify="center" align="center" gap=".5rem">
                  <Text size="sm" justify="center" as="b">
                    Role:
                  </Text>
                  <Text size="sm" justify="center">
                    {role}
                  </Text>
                </Flex>
                <Flex justify="center" align="center" gap=".5rem">
                  <Text size="sm" justify="center" as="b">
                    Active:
                  </Text>
                  {isEditing &&
                  editing.id === _id &&
                  editing.field === 'active' ? (
                    <FormControl>
                      <form onSubmit={handleSubmitActive}>
                        <InputGroup size="md">
                          <Input
                            type="text"
                            value={editedActive}
                            onChange={(e) => setEditedActive(e.target.value)}
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              size="sm"
                              h="1.75rem"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </form>
                    </FormControl>
                  ) : (
                    <Flex justify="center" align="center" gap="1rem">
                      {active ? 'true' : 'false'}
                      <IconButton
                        size="sm"
                        aria-label="Edit active"
                        icon={<EditIcon />}
                        onClick={() => {
                          setEditedActive(active)
                          handleEdit(_id, 'active')
                          setEditedId(_id)
                          setIsEditing(true)
                        }}
                      />
                    </Flex>
                  )}
                </Flex>
              </CardBody>
              <CardFooter justify="center">
                {' '}
                <IconButton
                  onClick={() => handleOpen(_id)}
                  size="md"
                  colorScheme="red"
                  aria-label="Remove from users"
                  icon={<DeleteIcon />}
                />
              </CardFooter>
            </Card>
          )
        })}
      </SimpleGrid>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleRemoveUser(userId)}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default Users
