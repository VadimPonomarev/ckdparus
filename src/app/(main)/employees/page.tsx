'use client';

import {
  Box,
  Center,
  Grid,
  Heading,
  HStack,
  Image,
  List,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';

export default function Epmployess() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">
        Сотрудники
      </Text>
      <Separator />
      <Stack gap={10} pt={10}>
        <Text fontSize="xl">Администрация</Text>
        <Center>
          <Box>
            <Heading textAlign="center" py={10} textDecoration="underline">
              Директор
            </Heading>
            <HStack gap={20}>
              <Image
                src="photo_director.jpg"
                alt="Симон Лариса Геннадьевна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                <Text fontWeight="bold" textAlign="center">
                  Симон Лариса Геннадьевна
                </Text>
              </Box>
            </HStack>
          </Box>
        </Center>
        <HStack justify="space-around" gap={10}>
          <Box>
            <Heading textAlign="center" py={10} textDecoration="underline">
              Заместитель директора
            </Heading>
            <HStack gap={20}>
              <Image
                src="photo_zam_directora.jpg"
                alt="Костикова Татьяна Николаевна"
                objectFit="cover"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                h="250px"
              />
              <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                <Text fontWeight="bold" textAlign="center">
                  Костикова Татьяна Николаевна
                </Text>
              </Box>
            </HStack>
          </Box>
          <Box>
            <Heading textAlign="center" py={10} textDecoration="underline">
              Заместитель директора по хоз.части
            </Heading>
            <HStack gap={20}>
              <Image
                src="photo_zam_directora_ahch.jpg"
                alt="Корныхина Светлана Владимировна"
                objectFit="fill"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                h="250px"
              />
              <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                <Text fontWeight="bold" textAlign="center">
                  Корныхина Светлана Владимировна
                </Text>
              </Box>
            </HStack>
          </Box>
          <Box>
            <Heading textAlign="center" py={10} textDecoration="underline">
              Художественный руководитель
            </Heading>
            <HStack gap={20}>
              <Image
                src="hud_ruk.jpg"
                alt="Сорокина Анастасия Андреевна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                <Text fontWeight="bold" textAlign="center">
                  Сорокина Анастасия Андреевна
                </Text>
              </Box>
            </HStack>
          </Box>
        </HStack>

        <Text fontSize="xl">Руководители клубных формирований</Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={10}>
          <Box>
            <HStack gap={20}>
              <Image
                src="samarokovskay.jpg"
                alt="Самороковская Анна Викторовна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Stack>
                <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                  <Text fontWeight="bold" textAlign="center">
                    Самороковская Анна Викторовна
                  </Text>
                </Box>
                <Text>Коллективы:</Text>
                <List.Root>
                  <List.Item>
                    Заслуженный коллектив народного творчества, образцовый
                    хореографический ансамбль «Славяночка»
                  </List.Item>
                  <List.Item>Хореографическая студия «Арлекино»</List.Item>
                  <List.Item>Хореографический коллектив «Забавушки»</List.Item>
                </List.Root>
              </Stack>
            </HStack>
          </Box>
          <Box>
            <HStack gap={20}>
              <Image
                src="petrova.jpg"
                alt="Петрова Ирина Валерьевна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Stack>
                <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                  <Text fontWeight="bold" textAlign="center">
                    Петрова Ирина Валерьевна
                  </Text>
                </Box>
                <Text>Коллективы:</Text>
                <List.Root>
                  <List.Item>
                    Образцовый хореографический ансамбль «Луиза»
                  </List.Item>
                  <List.Item>Хореографическая студия «Ириски»</List.Item>
                  <List.Item>Хореографическая студия «Ириски Kids»</List.Item>
                </List.Root>
              </Stack>
            </HStack>
          </Box>
          <Box alignItems="center" display="flex">
            <HStack gap={20}>
              <Image
                src="hud_ruk.jpg"
                alt="Сорокина Анастасия Андреевна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Stack>
                <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                  <Text fontWeight="bold" textAlign="center">
                    Сорокина Анастасия Андреевна
                  </Text>
                </Box>
                <Text>Коллективы:</Text>
                <List.Root>
                  <List.Item>Театральная студия «Имаго»</List.Item>
                </List.Root>
              </Stack>
            </HStack>
          </Box>
          <Box>
            <HStack gap={20}>
              <Image
                src="salaeva.jpg"
                alt="Салаева Ирина Сергеевна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Stack>
                <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                  <Text fontWeight="bold" textAlign="center">
                    Салаева Ирина Сергеевна
                  </Text>
                </Box>
                <Text>Коллективы:</Text>
                <List.Root>
                  <List.Item>
                    Народный коллектив самодеятельного художественного
                    творчества молодежный театр «Молодая гвардия»
                  </List.Item>
                </List.Root>
              </Stack>
            </HStack>
          </Box>
          <Box>
            <HStack gap={20}>
              <Image
                src="kuzmina.jpg"
                alt="Кузьмина Светлана Андреевна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Stack>
                <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                  <Text fontWeight="bold" textAlign="center">
                    Кузьмина Светлана Андреевна
                  </Text>
                </Box>
                <Text>Коллективы:</Text>
                <List.Root>
                  <List.Item>
                    Ансамбль патриотической песни «Наследие»
                  </List.Item>
                  <List.Item>Вокальный ансамбль «Веретёнце»</List.Item>
                  <List.Item>Вокальный ансамбль «Звонцы»</List.Item>
                  <List.Item>Фольклорный ансамбль «Зёрнышки»</List.Item>
                </List.Root>
              </Stack>
            </HStack>
          </Box>
          <Box>
            <HStack gap={20}>
              <Image
                src="mizurin.jpg"
                alt="Мурзин Юрий Игоревич"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Stack>
                <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                  <Text fontWeight="bold" textAlign="center">
                    Мурзин Юрий Игоревич
                  </Text>
                </Box>
                <Text>Коллективы:</Text>
                <List.Root>
                  <List.Item>
                    Народный коллектив «Оркестр русских народных инструментов
                    имени Юрия Владимировича Никулина»
                  </List.Item>
                  <List.Item>
                    Народный ансамбль русской песни «Прялица»
                  </List.Item>
                </List.Root>
              </Stack>
            </HStack>
          </Box>
          <Box>
            <HStack gap={20}>
              <Image
                src="shleikova.jpg"
                alt="Шлейкова Оксана Викторовна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Stack>
                <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                  <Text fontWeight="bold" textAlign="center">
                    Шлейкова Оксана Викторовна
                  </Text>
                </Box>
                <Text>Коллективы:</Text>
                <List.Root>
                  <List.Item>Народная вокальная студия «Ассорти»</List.Item>
                </List.Root>
              </Stack>
            </HStack>
          </Box>
          <Box alignItems="center" display="flex">
            <HStack gap={20}>
              <Image
                src="hernyakova.jpg"
                alt="Чернякова Луиза Степановна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Stack>
                <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                  <Text fontWeight="bold" textAlign="center">
                    Чернякова Луиза Степановна
                  </Text>
                </Box>
                <Text>Коллективы:</Text>
                <List.Root>
                  <List.Item>Народный хор ветеранов «Вдохновение»</List.Item>
                </List.Root>
              </Stack>
            </HStack>
          </Box>
          <Box>
            <HStack gap={20}>
              <Image
                src="photo_zam_directora.jpg"
                alt="Костикова Татьяна Николаевна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Stack>
                <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                  <Text fontWeight="bold" textAlign="center">
                    Костикова Татьяна Николаевна
                  </Text>
                </Box>
                <Text>Коллективы:</Text>
                <List.Root>
                  <List.Item>
                    Объединение турникменов «STREET WARRIORS»
                  </List.Item>
                </List.Root>
              </Stack>
            </HStack>
          </Box>
          <Box alignItems="center" display="flex">
            <HStack gap={20}>
              <Image
                src="galdikas.jpg"
                alt="Галдикайте Александра Валерьевна"
                objectFit="contain"
                borderRadius="20px"
                boxShadow="xl"
                borderColor="gray.100"
                _hover={{
                  boxShadow: '2xl',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                w="250px"
              />
              <Stack>
                <Box bg="blue.300" p={3} borderRadius={10} boxShadow="xl">
                  <Text fontWeight="bold" textAlign="center">
                    Галдикайте Александра Валерьевна
                  </Text>
                </Box>
                <Text>Коллективы:</Text>
                <List.Root>
                  <List.Item>Медиацентр «Первые на связи!»</List.Item>
                </List.Root>
              </Stack>
            </HStack>
          </Box>
        </Grid>
      </Stack>
    </Box>
  );
}
