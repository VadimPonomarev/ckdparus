import { Box, Center, HStack, Image, Stack, Text } from '@chakra-ui/react';

const Headerpicture = () => {
  return (
    <HStack width="100%" height="200px" justify="space-around">
      <Image
        src="HeaderPicture.jpg"
        alt="Header"
        objectFit="contain"
        borderRadius="20px"
        // width="100%"
        height="100%"
      />
      <Center w="100%" px="20px">
        <Text fontSize="2xl" fontWeight="bold">
          Официальный сайт Центра культуры и досуга "Парус" города Советск
        </Text>
      </Center>
      <Image
        src="logo.jpg"
        alt="Header"
        objectFit="contain"
        borderRadius="50%"
        // width="100%"
        height="100%"
      />
    </HStack>
  );
};

export default Headerpicture;
