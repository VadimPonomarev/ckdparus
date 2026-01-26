import { Box, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { FaVk } from 'react-icons/fa6';

const Preheader = () => {
  return (
    <Stack direction="row" h="20">
      <HStack justifyContent="space-between" w="100%">
        <HStack
          cursor="pointer"
          _hover={{
            '& > *': {
              transform: 'translateY(-4px)',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        >
          <Icon size="xl" color="blue.500">
            <FaVk />
          </Icon>
          <Text fontWeight="bold" fontSize="xl">
            В КОНТАКТЕ
          </Text>
        </HStack>
        <Stack>
          <HStack>
            <Text>Телефон для справки и заказа билетов</Text>
            <Text>+7 901 963 20 63</Text>
          </HStack>
          <Text>
            Режим работы: ежедневно с 08:00 до 21:00, по согласованию до 22:00
          </Text>
        </Stack>
      </HStack>
    </Stack>
  );
};

export default Preheader;
