import { Box, HStack, Icon, Link, Stack, Text } from '@chakra-ui/react';
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
        <Stack fontSize="18px" fontWeight="bold">
          <HStack justifyContent="end">
            <Link
              color="blue.600"
              textAlign="end"
              cursor="pointer"
              href="tel:+79019632063"
            >
              +7 901 963 20 63
            </Link>
          </HStack>
          <Text>Режим работы: 8:00-21:00</Text>
        </Stack>
      </HStack>
    </Stack>
  );
};

export default Preheader;
