import { Flex, Box, Text } from '@chakra-ui/react'

import { useSelector } from 'react-redux'

const Error = () => {
  const errorMsg = useSelector((state) => state.app.errorMsg)
  return (
    <Box flex="1">
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="75vh"
      >
        <Text fontSize="3xl">
          {errorMsg ? errorMsg : 'There is nothing to see yet.'}
        </Text>
      </Flex>
    </Box>
  )
}

export default Error
