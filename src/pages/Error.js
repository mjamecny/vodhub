import { Link } from "react-router-dom"
import { Flex, Box, Heading, Text } from "@chakra-ui/react"

const Error = (props) => {
  return (
    <Box
      bg="#212529"
      color="#ced4da"
      flexGrow="1"
      flexShrink="1"
      paddingY="3.2rem"
      paddingX="8rem"
    >
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
