import { Box, Center, HStack, Image, Stack, Text } from '@chakra-ui/react';
// Убираем Dancing Script, добавляем Inter
import '@fontsource/inter/700.css'; // Для жирного начертания
import '@fontsource/inter/400.css'; // Для обычного, если понадобится

const Headerpicture = () => {
  return (
    <Stack
      width="100%"
      height={{ base: '100%', md: '200px' }}
      justify={{ base: 'center', md: 'space-around' }}
      direction={{ base: 'column', md: 'row' }}
      gap={10}
      backgroundImage={{ base: 'none', md: 'url(/images/most_blue_2.png)' }}
      backgroundSize="contain"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
    >
      <Image
        src="/images/year_edin.jpeg"
        alt="Header"
        objectFit="contain"
        height={{ md: '180px' }}
        borderRadius="20px"
      />

      <Image
        position="relative"
        src="/images/logo_blue.png"
        alt="Header"
        objectFit="contain"
        borderRadius="20px"
        w={{ base: '100%', md: '70%' }}
        zIndex={1}
      />

      <Center w="100%" px="20px" height="100%">
        <Stack
          textTransform="uppercase"
          fontSize="24px"
          fontWeight="600"
          textAlign="center"
          fontFamily="'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
          color="blue.600"
          textShadow="2px 2px 4px #4ea3db"
          lineHeight="1.2"
          letterSpacing="0.5px"
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
