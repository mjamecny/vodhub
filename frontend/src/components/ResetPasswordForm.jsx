import {
  FormControl,
  Flex,
  FormLabel,
  Input,
  Button,
  useToast,
  Spinner,
} from '@chakra-ui/react'

import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useLazyResetPasswordQuery } from '../store'
import { useSignIn } from 'react-auth-kit'

const ResetPasswordForm = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const [resetPassword, result] = useLazyResetPasswordQuery()
  const [password, setPassword] = useState('')
  const { token } = useParams()
  const signIn = useSignIn()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await resetPassword({ token, password })
    if (res.isSuccess) {
      if (
        signIn({
          token: res.data.token,
          expiresIn: 30,
          tokenType: 'Bearer',
          authState: {
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
          },
        })
      )
        toast({
          position: 'top',
          description: 'Password reset successfully',
          status: 'success',
          duration: 3000,
          isClosable: false,
        })
      setPassword('')
      navigate('/')
    } else {
      console.log(res.error)
      toast({
        position: 'top',
        description: res.error.data.message,
        status: 'error',
        duration: 3000,
        isClosable: false,
      })
    }
  }

  return (
    <FormControl flex="1">
      <form onSubmit={handleSubmit}>
        <Flex
          flexDirection="column"
          align="center"
          justify="center"
          gap="1rem"
          height="75vh"
        >
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            w="40%"
          />
          <Button type="submit">
            {result.isLoading ? <Spinner /> : 'Submit'}
          </Button>
        </Flex>
      </form>
    </FormControl>
  )
}

export default ResetPasswordForm
