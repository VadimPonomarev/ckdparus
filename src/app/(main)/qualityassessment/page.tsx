import { Separator, Stack, Text, Link, Box, Image } from '@chakra-ui/react';

export default function QualityAssessment() {
  return (
    <Stack gap={6}>
      <Text fontSize="2xl" fontWeight="bold">
        Независимая оценка качества
      </Text>
      <Separator />

      <Image
        src="/images/qualityassessment.png"
        alt="QR код независимая оценка качества"
        objectFit="contain"
        h="350px"
      />

      <Separator />
      <Text fontSize="md" lineHeight="tall">
        <Text as="span" fontWeight="semibold">
          Уважаемые посетители!
        </Text>{' '}
        Просим вас оценить работу нашей организации, пройдя по ссылке:{' '}
        <Link
          href="https://forms.mkrf.ru/e/2579/xTPLeBU7/?ap_orgcode=510160036"
          color="teal.500"
          fontWeight="medium"
          _hover={{ color: 'teal.600', textDecoration: 'underline' }}
          wordBreak="break-all"
        >
          https://forms.mkrf.ru/e/2579/xTPLeBU7/?ap_orgcode=510160036
        </Link>
      </Text>

      <Text fontSize="md" lineHeight="tall" color="gray.600">
        Ваше мнение очень важно не только для нас, но для Министерства культуры
        Российской Федерации. Оно поможет получить независимую и честную оценку
        удовлетворенности граждан России работой государственных и муниципальных
        организаций культуры, искусства и народного творчества.
      </Text>

      <Box
        bg="yellow.50"
        _dark={{ bg: 'yellow.950' }}
        p={4}
        borderRadius="md"
        borderLeftWidth="4px"
        borderLeftColor="yellow.400"
      >
        <Text fontWeight="bold" mb={1}>
          ВАЖНО!
        </Text>
        <Text fontSize="sm">
          Опрос могут проходить только граждане, достигшие 18-летнего возраста.
        </Text>
      </Box>
    </Stack>
  );
}
