import { Box, Center, HStack, Image, Stack, Text } from '@chakra-ui/react';
import '@fontsource/dancing-script/700.css';

const Headerpicture = () => {
  return (
    <Stack
      width="100%"
      height="100%"
      justify={{ base: 'center', md: 'space-around' }}
      direction={{ base: 'column', md: 'row' }}
      gap={10}
    >
      <HStack w="100%" position="relative" pt={{ base: 10, md: 0 }}>
        <Image
          position="relative"
          src="/images/logo_blue.png"
          alt="Header"
          objectFit="contain"
          borderRadius="20px"
          // height="100%"
          w="70%"
          zIndex={1}
        />
        <Box
          position="absolute"
          right={{ base: '-1', md: '-10%' }}
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
        height={{ md: '180px' }}
        borderRadius="20px"
      />
      <Image
        src="/images/80_kal.png"
        alt="Header"
        objectFit="contain"
        height={{ md: '180px' }}
        borderRadius="20px"
      />
    </Stack>
  );
};

export default Headerpicture;
