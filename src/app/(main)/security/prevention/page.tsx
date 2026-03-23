import {
  Separator,
  Stack,
  Text,
  Box,
  Heading,
  List,
  Grid,
  Card,
  Badge,
  Icon,
} from '@chakra-ui/react';

export default function AntisocialPrevention() {
  const alternativeSpaces = [
    'Коворкинги с бесплатным Wi-Fi',
    'Зоны с настольными играми',
    'Студии звукозаписи',
    'Школы диджеинга',
    'Залы для брейк-данса',
    'Граффити-площадки',
  ];

  const eventForms = [
    'Фестивали экстремальных видов спорта',
    'Рэп-баттлы под эгидой центра',
    'Косплей-дефиле',
    'Кинодискуссии с модератором-психологом',
    'Форум-театры с изменяемым финалом',
  ];

  const volunteerActivities = [
    'Привлечение "трудных" подростков к организации городских праздников',
    'Участие в охране порядка и помощи артистам',
    'Квесты на социальную тематику',
    'Правовое ориентирование в игровом стиле',
    'Антинаркотическая пропаганда через квесты',
  ];

  const approachPrinciples = [
    'Уход от назидательности — информационный посыл скрыт внутри интересного контента',
    'Доступность — отсутствие строгой записи, бесплатные кружки для льготных категорий',
    'Современный визуальный язык в афишах и соцсетях',
  ];

  return (
    <Stack gap={8}>
      <Text fontSize="2xl" fontWeight="bold">
        Профилактика антисоциальных явлений
      </Text>
      <Separator />

      {/* Описание подхода */}
      <Box bg="gray.50" p={6} borderRadius="lg">
        <Text fontSize="lg" fontStyle="italic" color="gray.700" mb={3}>
          «Мы не просто запрещаем плохое, а предлагаем интересную и статусную
          альтернативу»
        </Text>
        <Text color="gray.600">
          Профилактика в центре культуры и досуга (ЦКиД) строится на принципе
          «замещения». В отличие от школы, здесь нет принуждения, поэтому методы
          должны быть максимально вовлекающими.
        </Text>
      </Box>

      <Separator />

      {/* Альтернативный досуг */}
      <Box>
        <Heading size="md" mb={4} color="blue.700">
          Альтернативный досуг
        </Heading>
        <Text fontWeight="semibold" mb={3} color="gray.600">
          Создание «третьего места»
        </Text>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
          {alternativeSpaces.map((space, index) => (
            <Card.Root key={index} p={3} variant="outline">
              <Text>{space}</Text>
            </Card.Root>
          ))}
        </Grid>
      </Box>

      <Separator />

      {/* Событийная профилактика */}
      <Box>
        <Heading size="md" mb={4} color="blue.700">
          Событийная профилактика
        </Heading>
        <List.Root gap={3}>
          {eventForms.map((event, index) => (
            <List.Item key={index}>
              <Badge colorScheme="blue" mr={2}>
                •
              </Badge>
              {event}
            </List.Item>
          ))}
        </List.Root>
      </Box>

      <Separator />

      {/* Социальное проектирование и волонтерство */}
      <Box>
        <Heading size="md" mb={4} color="blue.700">
          Социальное проектирование и волонтерство
        </Heading>
        <List.Root gap={3}>
          {volunteerActivities.map((activity, index) => (
            <List.Item key={index}>
              <Badge colorScheme="green" mr={2}>
                ✓
              </Badge>
              {activity}
            </List.Item>
          ))}
        </List.Root>
      </Box>

      <Separator />

      {/* Работа с лидерами мнений */}
      <Box>
        <Heading size="md" mb={4} color="blue.700">
          Работа с лидерами мнений
        </Heading>
        <Card.Root p={4} bg="blue.50">
          <Text>
            Приглашение в центр популярных среди молодежи блогеров, спортсменов
            или музыкантов, которые транслируют ценности здорового образа жизни
            и саморазвития.
          </Text>
        </Card.Root>
      </Box>

      <Separator />

      {/* Специфика подхода */}
      <Box>
        <Heading size="md" mb={4} color="blue.700">
          Специфика подхода
        </Heading>
        <List.Root gap={3}>
          {approachPrinciples.map((principle, index) => (
            <List.Item key={index}>
              <Badge colorScheme="orange" mr={2}>
                •
              </Badge>
              {principle}
            </List.Item>
          ))}
        </List.Root>
      </Box>

      <Separator />

      {/* Методические рекомендации */}
      <Box textAlign="center">
        <Text
          fontSize="lg"
          fontStyle="italic"
          fontWeight="bold"
          color="gray.600"
        >
          Методические рекомендации
        </Text>
      </Box>

      <List.Root gap={4}>
        <List.Item>
          <Text color="blue.600" _hover={{ color: 'blue.500' }}>
            Организация профилактической работы с молодежью в учреждениях
            культуры
          </Text>
        </List.Item>
        <List.Item>
          <Text color="blue.600" _hover={{ color: 'blue.500' }}>
            Методика проведения форум-театров для подростков
          </Text>
        </List.Item>
        <List.Item>
          <Text color="blue.600" _hover={{ color: 'blue.500' }}>
            Создание «третьих мест»: лучшие практики
          </Text>
        </List.Item>
        <List.Item>
          <Text color="blue.600" _hover={{ color: 'blue.500' }}>
            Вовлечение молодежи в социальное проектирование
          </Text>
        </List.Item>
      </List.Root>

      <Box textAlign="center">
        <Text
          fontSize="lg"
          fontStyle="italic"
          fontWeight="bold"
          color="gray.600"
        >
          Практические пособия
        </Text>
      </Box>

      <List.Root gap={3}>
        <List.Item>
          <Text color="blue.600" _hover={{ color: 'blue.500' }}>
            Сборник сценариев антинаркотических квестов
          </Text>
        </List.Item>
        <List.Item>
          <Text color="blue.600" _hover={{ color: 'blue.500' }}>
            Как работать с лидерами неформальных объединений
          </Text>
        </List.Item>
        <List.Item>
          <Text color="blue.600" _hover={{ color: 'blue.500' }}>
            Организация волонтерских отрядов на базе ЦКиД
          </Text>
        </List.Item>
        <List.Item>
          <Text color="blue.600" _hover={{ color: 'blue.500' }}>
            Профилактика через уличную культуру: граффити, хип-хоп, спорт
          </Text>
        </List.Item>
      </List.Root>

      <Box
        textAlign="center"
        py={6}
        borderTop="1px solid"
        borderColor="gray.200"
      >
        <Text
          fontSize="lg"
          fontStyle="italic"
          fontWeight="bold"
          color="gray.700"
          mb={4}
        >
          Горячая линия по вопросам профилактики – 8 (800) 200-01-22
        </Text>
        <Text
          fontSize="md"
          color="blue.600"
          display="inline-flex"
          alignItems="center"
          gap={2}
        >
          Портал «Профилактика в сфере культуры»
        </Text>
      </Box>
    </Stack>
  );
}
