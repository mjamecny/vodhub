import { Flex, Button, Heading, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useIsAuthenticated } from 'react-auth-kit'

const Welcome = () => {
  const isAuthenticated = useIsAuthenticated()
  return (
    <Flex flexDirection="column" justify="center" align="center" flex="1">
      <Heading>Welcome to VODhub</Heading>
      <Text>Search and add to Favorites Twitch VODs</Text>
      {!isAuthenticated() && (
        <Flex mt="2rem" gap="1rem">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </Flex>
      )}
    </Flex>
  )
}
export default Welcome
