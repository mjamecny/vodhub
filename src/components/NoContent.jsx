import { Flex, Text } from '@chakra-ui/react'

const NoContent = ({ msg }) => {
  return (
    <Flex
      fontSize={{ base: 'lg', xl: '3xl' }}
      justifyContent="center"
      alignItems="center"
      paddingX={{ base: '3rem', lg: '15rem' }}
      height="75vh"
      flex="1"
    >
      <Text textAlign="center">{msg}</Text>
    </Flex>
  )
}
export default NoContent
