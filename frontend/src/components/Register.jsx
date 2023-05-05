import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react'
import {
  setUsername,
  setEmail,
  setPassword,
  useLazyRegisterQuery,
} from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useSignIn } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const signIn = useSignIn()
  const { username, email, password } = useSelector((state) => state.user)
  const [register] = useLazyRegisterQuery()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await register({ username, email, password })

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
        dispatch(setUsername(''))
      dispatch(setEmail(''))
      dispatch(setPassword(''))
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
    <FormControl>
      <form onSubmit={handleSubmit}>
        <Flex
          flexDirection="column"
          align="center"
          justify="center"
          gap="1rem"
          height="75vh"
        >
          <FormLabel htmlFor="name">Username</FormLabel>
          <Input
            id="username"
            name="username"
            value={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
            type="text"
            required
            w="40%"
          />
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            name="email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            type="email"
            required
            w="40%"
          />
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            name="password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            type="password"
            required
            w="40%"
          />
          <Button type="submit">Register</Button>
        </Flex>
      </form>
    </FormControl>
  )
}
export default Register
