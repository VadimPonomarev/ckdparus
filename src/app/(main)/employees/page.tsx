'use client';

import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  List,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';

// Типы для компонентов
interface AdminCardProps {
  title: string;
  name: string;
  image: string;
  colorScheme?: 'red' | 'blue' | 'green' | 'purple';
}

interface LeaderCardProps {
  image: string;
  name: string;
  children: React.ReactNode;
  colorScheme?: 'gray'; // Добавляем цвет для руководителей
}

// Компонент для карточки сотрудника администрации
const AdminCard = ({
  title,
  name,
  image,
  colorScheme = 'red',
}: AdminCardProps) => {
  const shadowColor = {
    red: 'var(--chakra-colors-red-600)',
    blue: 'var(--chakra-colors-blue-600)',
    green: 'var(--chakra-colors-green-600)',
    purple: 'var(--chakra-colors-purple-600)',
  }[colorScheme];

  return (
    <Box
      textAlign="center"
      borderRadius={10}
      p={6}
      boxShadow={`0 0px 10px ${shadowColor}`}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Heading
        py={5}
        textDecoration="underline"
        fontSize="2xl"
        minHeight="80px"
      >
        {title}
      </Heading>
      <Center flex="1">
        <Stack align="center" gap={4} width="100%">
          <Image
            src={image}
            alt={name}
            objectFit="cover"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            height="250px"
            width="250px"
          />
          <Box
            bg="blue.300"
            p={3}
            borderRadius={10}
            boxShadow="xl"
            width="100%"
          >
            <Text fontWeight="bold" textAlign="center">
              {name}
            </Text>
          </Box>
        </Stack>
      </Center>
    </Box>
  );
};

// Компонент для карточки руководителя с серой тенью
const LeaderCard = ({
  image,
  name,
  children,
  colorScheme = 'gray',
}: LeaderCardProps) => {
  const shadowColor = {
    gray: 'var(--chakra-colors-gray-600)',
  }[colorScheme];

  return (
    <Box
      borderRadius={10}
      p={6}
      boxShadow={`0 0px 10px ${shadowColor}`}
      height="100%"
      width="100%"
    >
      <HStack gap={6} align="start" height="100%">
        <Image
          src={image}
          alt={name}
          objectFit="cover"
          borderRadius="20px"
          boxShadow="xl"
          borderColor="gray.100"
          _hover={{
            boxShadow: '2xl',
            transition: 'box-shadow 0.3s ease-in-out',
          }}
          width="200px"
          height="200px"
          flexShrink={0}
        />
        <Stack height="100%" width="100%">
          <Box
            bg="blue.300"
            p={3}
            borderRadius={10}
            boxShadow="xl"
            width="100%"
          >
            <Text fontWeight="bold" textAlign="center">
              {name}
            </Text>
          </Box>
          <Box>{children}</Box>
        </Stack>
      </HStack>
    </Box>
  );
};

export default function Employees() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">
        Сотрудники
      </Text>
      <Separator />
      <Stack gap={10} pt={10}>
        <Text fontSize="xl" textAlign="center" fontWeight="bold">
          Администрация
        </Text>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={10}>
          <GridItem></GridItem>
          <GridItem>
            <AdminCard
              title="Директор"
              name="Симон Лариса Геннадьевна"
              image="/images/photo_director.jpg"
              colorScheme="red"
            />
          </GridItem>
          <GridItem></GridItem>
        </Grid>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={10}>
          <GridItem>
            <AdminCard
              title="Заместитель директора"
              name="Костикова Татьяна Николаевна"
              image="/images/photo_zam_directora.jpg"
              colorScheme="blue"
            />
          </GridItem>
          <GridItem>
            <AdminCard
              title="Заместитель директора по АХЧ"
              name="Корныхина Светлана Владимировна"
              image="/images/photo_zam_directora_ahch.jpg"
              colorScheme="green"
            />
          </GridItem>

          <GridItem>
            <AdminCard
              title="Главный Бухгалтер"
              name="Шалунова Анжела Витальевна"
              image="/images/logo.jpg"
              colorScheme="purple"
            />
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={10}>
          <GridItem>
            <AdminCard
              title="Методист"
              name="Дзнеладзе Манана Элдаровна"
              image="/images/logo.jpg"
              colorScheme="blue"
            />
          </GridItem>

          <GridItem>
            <AdminCard
              title="Художественный руководитель"
              name="Гаршина Мария Александровна"
              image="/images/logo.jpg"
              colorScheme="blue"
            />
          </GridItem>

          <GridItem>
            <AdminCard
              title="Рабочий по ремонту и комплексному обслуживанию здания"
              name="Осокин Владимир Петрович"
              image="/images/logo.jpg"
              colorScheme="green"
            />
          </GridItem>

          <GridItem>
            <AdminCard
              title="Бухгалтер"
              name="Алфимова Ольга Николаевна"
              image="/images/logo.jpg"
              colorScheme="purple"
            />
          </GridItem>
        </Grid>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={10}>
          <GridItem>
            <AdminCard
              title="Звукорежиссёр"
              name="Гаршин Александр Сергеевич"
              image="/images/logo.jpg"
              colorScheme="blue"
            />
          </GridItem>
          <GridItem>
            <AdminCard
              title="Звукорежиссёр"
              name="Петров Валерий Владимирович"
              image="/images/logo.jpg"
              colorScheme="blue"
            />
          </GridItem>
          <GridItem>
            <AdminCard
              title="Культорганизатор"
              name="Орлова Дарья Олеговна"
              image="/images/logo.jpg"
              colorScheme="blue"
            />
          </GridItem>
          <GridItem>
            <AdminCard
              title="Светооператор"
              name="Симон Валентин Валерьевич"
              image="/images/logo.jpg"
              colorScheme="blue"
            />
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={10}>
          <GridItem>
            <AdminCard
              title="Костюмер"
              name="Кузнецова Юлия Николаевна"
              image="/images/logo.jpg"
              colorScheme="blue"
            />
          </GridItem>
          <GridItem>
            <AdminCard
              title="Костюмер"
              name="Орлова Дарья Олеговна"
              image="/images/logo.jpg"
              colorScheme="blue"
            />
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
        </Grid>

        <Text fontSize="xl" textAlign="center" fontWeight="bold">
          Руководители клубных формирований
        </Text>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
          <GridItem>
            <LeaderCard
              image="/images/samarokovskay.jpg"
              name="Самороковская Анна Викторовна"
              colorScheme="gray"
            >
              <Text>Коллективы:</Text>
              <List.Root pl={10}>
                <List.Item>
                  Заслуженный коллектив народного творчества, образцовый
                  хореографический ансамбль «Славяночка»
                </List.Item>
                <List.Item>Хореографическая студия «Арлекино»</List.Item>
                <List.Item>Хореографический коллектив «Забавушки»</List.Item>
              </List.Root>
            </LeaderCard>
          </GridItem>

          <GridItem>
            <LeaderCard
              image="/images/petrova.jpg"
              name="Петрова Ирина Валерьевна"
              colorScheme="gray"
            >
              <Text>Коллективы:</Text>
              <List.Root pl={10}>
                <List.Item>
                  Образцовый хореографический ансамбль «Луиза»
                </List.Item>
                <List.Item>Хореографическая студия «Ириски»</List.Item>
                <List.Item>Хореографическая студия «Ириски Kids»</List.Item>
              </List.Root>
            </LeaderCard>
          </GridItem>

          <GridItem>
            <LeaderCard
              image="/images/hud_ruk.jpg"
              name="Сорокина Анастасия Андреевна"
              colorScheme="gray"
            >
              <Text>Коллективы:</Text>
              <List.Root pl={10}>
                <List.Item>Театральная студия «Имаго»</List.Item>
              </List.Root>
            </LeaderCard>
          </GridItem>

          <GridItem>
            <LeaderCard
              image="/images/salaeva.jpg"
              name="Салаева Ирина Сергеевна"
              colorScheme="gray"
            >
              <Text>Коллективы:</Text>
              <List.Root pl={10}>
                <List.Item>
                  Народный коллектив самодеятельного художественного творчества
                  молодежный театр «Молодая гвардия»
                </List.Item>
              </List.Root>
            </LeaderCard>
          </GridItem>

          <GridItem>
            <LeaderCard
              image="/images/kuzmina.jpg"
              name="Кузьмина Светлана Андреевна"
              colorScheme="gray"
            >
              <Text>Коллективы:</Text>
              <List.Root pl={10}>
                <List.Item>Ансамбль патриотической песни «Наследие»</List.Item>
                <List.Item>Вокальный ансамбль «Веретёнце»</List.Item>
                <List.Item>Вокальный ансамбль «Звонцы»</List.Item>
                <List.Item>Фольклорный ансамбль «Зёрнышки»</List.Item>
              </List.Root>
            </LeaderCard>
          </GridItem>

          <GridItem>
            <LeaderCard
              image="/images/mizurin.jpg"
              name="Мурзин Юрий Игоревич"
              colorScheme="gray"
            >
              <Text>Коллективы:</Text>
              <List.Root pl={10}>
                <List.Item>
                  Народный коллектив «Оркестр русских народных инструментов
                  имени Юрия Владимировича Никулина»
                </List.Item>
                <List.Item>Народный ансамбль русской песни «Прялица»</List.Item>
              </List.Root>
            </LeaderCard>
          </GridItem>

          <GridItem>
            <LeaderCard
              image="/images/shleikova.jpg"
              name="Шлейкова Оксана Викторовна"
              colorScheme="gray"
            >
              <Text>Коллективы:</Text>
              <List.Root pl={10}>
                <List.Item>Народная вокальная студия «Ассорти»</List.Item>
              </List.Root>
            </LeaderCard>
          </GridItem>

          <GridItem>
            <LeaderCard
              image="/images/hernyakova.jpg"
              name="Чернякова Луиза Степановна"
              colorScheme="gray"
            >
              <Text>Коллективы:</Text>
              <List.Root pl={10}>
                <List.Item>Народный хор ветеранов «Вдохновение»</List.Item>
              </List.Root>
            </LeaderCard>
          </GridItem>

          <GridItem>
            <LeaderCard
              image="/images/photo_zam_directora.jpg"
              name="Костикова Татьяна Николаевна"
              colorScheme="gray"
            >
              <Text>Коллективы:</Text>
              <List.Root pl={10}>
                <List.Item>Объединение турникменов «STREET WARRIORS»</List.Item>
              </List.Root>
            </LeaderCard>
          </GridItem>

          <GridItem>
            <LeaderCard
              image="/images/galdikas.jpg"
              name="Галдикайте Александра Валерьевна"
              colorScheme="gray"
            >
              <Text>Коллективы:</Text>
              <List.Root pl={10}>
                <List.Item>Медиацентр «Первые на связи!»</List.Item>
              </List.Root>
            </LeaderCard>
          </GridItem>
        </Grid>
      </Stack>
    </Box>
  );
}
