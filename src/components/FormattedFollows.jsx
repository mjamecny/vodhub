import { Text } from '@chakra-ui/react'

import { useGetStreamerFollowsQuery } from '../store'

const FormattedFollows = ({ id }) => {
  const { totalFollows } = useGetStreamerFollowsQuery(id, {
    skip: !id,
    selectFromResult: ({ data }) => {
      return {
        totalFollows: data?.total || '',
      }
    },
  })

  const changeNumberFormat = (number) => {
    return number.toLocaleString('en-US').replace(/,/g, ' ')
  }

  const formattedFollows = changeNumberFormat(totalFollows)
  return <Text>{formattedFollows}</Text>
}
export default FormattedFollows
