import { Flex, Text } from '@chakra-ui/react'

const NoFavs = () => {
  return (
    <Flex
      fontSize="4xl"
      justifyContent="center"
      alignItems="center"
      paddingX={{ base: '7.5rem', lg: '15rem' }}
      height="75vh"
    >
      <Text textAlign="center">
        Don't have any favorite videos saved yet? No problem! Just browse
        selection of videos from any Twitch streamer and click the "plus" button
        on any video you want to save for later.
      </Text>
    </Flex>
  )
}
export default NoFavs
