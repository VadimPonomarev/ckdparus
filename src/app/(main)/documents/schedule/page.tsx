import { Center, Image, Separator, Stack, Text } from '@chakra-ui/react';

export default function History() {
  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        Расписание клубных формирований
      </Text>
      <Separator />
      <Center>
        <Stack>
          <Image
            src="/images/raspisanie/0.jpg"
            alt="Расписание"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            w="1000px"
          />
          <Image
            src="/images/raspisanie/1.jpg"
            alt="Расписание"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            w="1000px"
          />
          <Image
            src="/images/raspisanie/2.jpg"
            alt="Распbсание"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            w="1000px"
          />
          <Image
            src="/images/raspisanie/3.jpg"
            alt="Распbсание"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            w="1000px"
          />
        </Stack>
      </Center>
    </Stack>
  );
}
