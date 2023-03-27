import { Flex, Text } from "@chakra-ui/react"

const Footer = () => {
  return (
    <Flex
      bg="#212529"
      justifyContent="center"
      alignItems="center"
      flexShrink="0"
      height="5rem"
    >
      <Text fontSize="md" color="#fff">
        &copy; 2023 VODhub
      </Text>
    </Flex>
  )
}

export default Footer
