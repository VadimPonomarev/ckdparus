import { Box, Center, HStack, Image, Stack, Text } from '@chakra-ui/react';
import '@fontsource/dancing-script/700.css';

const Headerpicture = () => {
  return (
    <HStack width="100%" height="250px" justify="space-around">
      <HStack w="100%" position="relative">
        <Image
          position="relative"
          src="/images/logo_blue.png"
          alt="Header"
          objectFit="contain"
          borderRadius="20px"
          // height="100%"
          w="70%"
        />
        <Box
          position="absolute"
          right="-10%"
          w="80%"
          css={{
            maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, black 70%, transparent 100%)',
          }}
        >
          <Image
            src="/images/most.png"
            alt="Header"
            objectFit="contain"
            w="100%"
          />
        </Box>
      </HStack>

      <Center w="100%" px="20px" height="100%">
        <Stack
          textTransform="uppercase"
          fontSize="24px"
          fontWeight="bold"
          textAlign="center"
          fontFamily="'Dancing Script', cursive"
          color="blue.600"
          textShadow="2px 2px 4px #4ea3db"
        >
          <Text position="relative" zIndex={1}>
            Официальный сайт
          </Text>
          <Text position="relative" zIndex={1}>
            Центра культуры и досуга "Парус"
          </Text>
          <Text position="relative" zIndex={1}>
            города Советск
          </Text>
        </Stack>
      </Center>

      <Image
        src="/images/year_edin.jpeg"
        alt="Header"
        objectFit="contain"
        height="180px"
        borderRadius="20px"
      />
      <Image
        src="/images/80_kal.png"
        alt="Header"
        objectFit="contain"
        height="180px"
        borderRadius="20px"
      />
    </HStack>
  );
};

export default Headerpicture;
