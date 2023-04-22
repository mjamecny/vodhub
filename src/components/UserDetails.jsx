import {
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Text,
  Flex,
  Avatar,
  Spinner,
  Icon,
  Tooltip,
} from '@chakra-ui/react'

import { FaHeart, FaRegCalendarAlt, FaTv } from 'react-icons/fa'

import { useGetUserByNameQuery, useGetStreamerFollowsQuery } from '../store'

const UserDetails = ({ user_login, user_id }) => {
  const { user, isFetching } = useGetUserByNameQuery(user_login, {
    skip: !user_login,
    selectFromResult: ({ data, isFetching }) => {
      return {
        user: data?.data[0] || {},
        isFetching,
      }
    },
  })

  const { totalFollows } = useGetStreamerFollowsQuery(user_id, {
    skip: !user_id,
    selectFromResult: ({ data }) => {
      return {
        totalFollows: data?.total || '',
      }
    },
  })

  const changeDateFormat = (date) => {
    const newDate = new Date(date)
    return [newDate.getMonth(), newDate.getDate(), newDate.getFullYear()]
  }

  const [month, day, year] = changeDateFormat(user.created_at)

  const changeNumberFormat = (number) => {
    return number.toLocaleString('en-US').replace(/,/g, ' ')
  }

  const formattedFollows = changeNumberFormat(totalFollows)
  const formattedViews = changeNumberFormat(user.view_count)

  return (
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverBody>
        {isFetching ? (
          <Spinner />
        ) : (
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap=".5rem"
          >
            <Avatar name={user.login} src={user.profile_image_url} />
            <Text>{user.description}</Text>
            <Flex gap=".5rem" width="300px" flexWrap="wrap" mt="1rem">
              <Flex
                flexDirection="column"
                justify="center"
                align="center"
                gap="0.25rem"
                flex="1"
              >
                <Tooltip label="Created">
                  <span>
                    <Icon as={FaRegCalendarAlt} />
                  </span>
                </Tooltip>
                <Text>{`${day}/${month + 1}/${year}`}</Text>
              </Flex>
              <Flex
                flexDirection="column"
                justify="center"
                align="center"
                gap="0.25rem"
                flex="1"
              >
                <Tooltip label="Total follows">
                  <span>
                    <Icon as={FaHeart} />
                  </span>
                </Tooltip>

                <Text>{formattedFollows}</Text>
              </Flex>
              <Flex
                flexDirection="column"
                justify="center"
                align="center"
                gap="0.25rem"
                flex="1"
              >
                <Tooltip label="Total views">
                  <span>
                    <Icon as={FaTv} />
                  </span>
                </Tooltip>
                <Text>{formattedViews}</Text>
              </Flex>
            </Flex>
          </Flex>
        )}
      </PopoverBody>
    </PopoverContent>
  )
}
export default UserDetails
