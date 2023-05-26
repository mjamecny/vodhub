import {
  Button,
  Flex,
  FormControl,
  Input,
  useToast,
  Spinner,
  Textarea,
} from '@chakra-ui/react'

import { useLazyContactQuery } from '../store'

import { useState } from 'react'

const ContactForm = () => {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [contact, result] = useLazyContactQuery()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await contact({ email, message, subject })
    if (!res.isError) {
      toast({
        position: 'top',
        description: 'Message sent',
        status: 'success',
        duration: 3000,
        isClosable: false,
      })

      setEmail('')
      setMessage('')
      setSubject('')
    } else {
      toast({
        position: 'top',
        description: 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: false,
      })
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <FormControl isRequired>
        <Flex
          flexDirection="column"
          align="center"
          justify="center"
          gap="1rem"
          height="75vh"
          flex="1"
        >
          <Input
            size="lg"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            w={{ base: '80%', md: '40%' }}
          />
          <Input
            size="lg"
            id="subject"
            name="subject"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            type="text"
            w={{ base: '80%', md: '40%' }}
          />
          <Textarea
            w={{ base: '80%', md: '50%' }}
            placeholder="Your message"
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit">
            {result.isLoading ? <Spinner /> : 'Send message'}
          </Button>
        </Flex>
      </FormControl>
    </form>
  )
}

export default ContactForm
