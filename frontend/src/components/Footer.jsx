import { Flex, Text, Icon } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <Flex flexDirection="column" align="center" justify="center" mt="1rem">
      <Flex gap="0.5rem" justify="center" align="center">
        <Link to="https://github.com/mjamecny/vodhub" target="blank">
          <Icon as={FaGithub} boxSize={5} />
        </Link>
        <Link to="/contact">Contact</Link>
      </Flex>
      <Text fontSize="l">&copy; {currentYear} VODhub</Text>
    </Flex>
  )
}
export default Footer
