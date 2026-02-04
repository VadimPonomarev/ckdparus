import { Box, Center, Image, Separator, Stack, Text } from '@chakra-ui/react';

export default function History() {
  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        План зрительного зала
      </Text>
      <Separator />
      <Center>
        <Stack>
          <Image
            src="/images/plan_zala.png"
            alt="План зала"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            w="700px"
          />
          <Image
            src="/images/zal.jpg"
            alt="Зал"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            w="700px"
          />
        </Stack>
      </Center>
    </Stack>
  );
}
