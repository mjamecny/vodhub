import { Flex, Heading, Text } from '@chakra-ui/react'

const Welcome = () => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="75vh"
      flex="1"
    >
      <Heading>Welcome to VODhub</Heading>
      <Text>Search and add to Favorites Twitch VODs</Text>
    </Flex>
  )
}
export default Welcome
