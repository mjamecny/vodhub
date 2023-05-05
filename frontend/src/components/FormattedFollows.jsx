import { Spinner, Text } from '@chakra-ui/react'
import { useGetStreamerFollowsQuery } from '../store'
import { changeNumberFormat } from '../utils'

const FormattedFollows = ({ id }) => {
  const { totalFollows, isFetching } = useGetStreamerFollowsQuery(id, {
    skip: !id,
    selectFromResult: ({ data, isFetching }) => {
      return {
        totalFollows: data?.total || '',
        isFetching,
      }
    },
  })

  const formattedFollows = changeNumberFormat(totalFollows)

  return <>{!isFetching ? <Text>{formattedFollows}</Text> : <Spinner />}</>
}
export default FormattedFollows
