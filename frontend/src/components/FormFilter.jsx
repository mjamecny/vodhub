import {
  FormControl,
  Center,
  InputGroup,
  Input,
  Button,
} from '@chakra-ui/react'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFiltering, setQuery, setFiltered } from '../store'

const FormFilter = ({ data }) => {
  const dispatch = useDispatch()
  const { query } = useSelector((state) => state.app)

  useEffect(() => {
    dispatch(setIsFiltering(true))
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    )
    dispatch(setFiltered(filtered))
    if (!query) {
      dispatch(setIsFiltering(false))
    }
  }, [query])

  return (
    <FormControl mt="2rem">
      <Center flexDirection={{ base: 'column', md: 'row' }}>
        <InputGroup
          w={{ base: '90%', md: '50%' }}
          size={{ base: 'lg' }}
          gap="1rem"
        >
          <Input
            placeholder="Filter by title"
            name="query"
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
          />
          <Button
            onClick={() => {
              dispatch(setIsFiltering(false))
              setQuery('')
            }}
          >
            Reset
          </Button>
        </InputGroup>
      </Center>
    </FormControl>
  )
}
export default FormFilter
