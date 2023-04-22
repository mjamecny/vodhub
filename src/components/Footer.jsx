import { Flex, Text, Icon, Link } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <Flex flexDirection="column" align="center" justify="center">
      <Flex gap="0.5rem" justify="center" align="center">
        <Link href="https://github.com/mjamecny/vodhub" target="blank">
          <Icon as={FaGithub} boxSize={5} />
        </Link>
      </Flex>
      <Text fontSize="l">&copy; 2023 VODhub</Text>
    </Flex>
  )
}
export default Footer
