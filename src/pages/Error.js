import { Flex, Box, Text } from '@chakra-ui/react'

const Error = (props) => {
  return (
    <Box flexGrow="1" flexShrink="1">
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="75vh"
      >
        <Text fontSize="3xl">{props.state.errorMsg}</Text>
      </Flex>
    </Box>
  )
}

export default Error
