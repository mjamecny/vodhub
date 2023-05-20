import { Flex, Text, Icon, Link } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <Flex flexDirection="column" align="center" justify="center" mt="1rem">
      <Flex gap="0.5rem" justify="center" align="center">
        <Link href="https://github.com/mjamecny/vodhub" target="blank">
          <Icon as={FaGithub} boxSize={5} />
        </Link>
      </Flex>
      <Text fontSize="l">&copy; {currentYear} VODhub</Text>
    </Flex>
  )
}
export default Footer
