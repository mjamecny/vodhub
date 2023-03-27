import { Link } from "react-router-dom"
import { Flex, Heading, Text } from "@chakra-ui/react"

const Error = () => {
  return (
    <Flex
      bg="#212529"
      color="#ced4da"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="85vh"
    >
      <Heading>404</Heading>
      <Text>Page not found</Text>
      <Text>
        <Link to="/">Home</Link>
      </Text>
    </Flex>
  )
}

export default Error
