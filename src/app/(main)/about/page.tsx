'use client';

import { Box, Text, VStack, HStack, Link, Container } from '@chakra-ui/react';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaBriefcase,
} from 'react-icons/fa';

export default function Page() {
  return (
    <Container maxW="container.xl">
      <VStack>
        <Box textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="blue.700">
            Муниципальное автономное учреждение культуры
          </Text>
          <Text fontSize="2xl" fontWeight="semibold" color="blue.600">
            “Центр культуры и досуга “Парус”
          </Text>
          <Text fontSize="lg" color="gray.600">
            (МАУК ЦКД “Парус”)
          </Text>
        </Box>
        <HStack align="start">
          <Box flex="1">
            <VStack align="start">
              <Box>
                <HStack>
                  <FaMapMarkerAlt color="#3182CE" />
                  <Text fontWeight="bold" fontSize="lg">
                    Адрес:
                  </Text>
                </HStack>
                <Text fontSize="md">
                  238750, Калининградская обл., г. Советск, ул. Победы, д. 34а
                </Text>
              </Box>
              <Box>
                <HStack>
                  <FaPhone color="#3182CE" />
                  <Text fontWeight="bold" fontSize="lg">
                    Телефон:
                  </Text>
                </HStack>
                <Text fontSize="md">+7 (40161) 3-35-60</Text>
              </Box>

              <Box>
                <HStack>
                  <FaEnvelope color="#3182CE" />
                  <Text fontWeight="bold" fontSize="lg">
                    E-mail:
                  </Text>
                </HStack>
                <Link
                  href="mailto:ckd-parus@mail.ru"
                  color="blue.600"
                  fontSize="md"
                  _hover={{ textDecoration: 'underline' }}
                >
                  ckd-parus@mail.ru
                </Link>
              </Box>
              <Box>
                <HStack>
                  <FaClock color="#3182CE" />
                  <Text fontWeight="bold" fontSize="lg">
                    Режим работы:
                  </Text>
                </HStack>
                <VStack align="start">
                  <Text fontSize="md">Ежедневно с 08:00 до 21:00</Text>
                  <Text fontSize="md" color="gray.600">
                    по согласованию до 22:00
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </Box>
          <Box flex="1">
            <VStack align="start">
              <Box width="100%">
                <Text fontWeight="bold" fontSize="lg" color="blue.700">
                  Реквизиты организации:
                </Text>
                <VStack align="start">
                  <Text>
                    <strong>ИНН:</strong> 3911001237
                  </Text>
                  <Text>
                    <strong>ОГРН:</strong> 1023902002706
                  </Text>
                  <Text>
                    <strong>ОКВЭД:</strong> 90.04.3
                  </Text>
                </VStack>
              </Box>
              <Box width="100%">
                <HStack>
                  <FaBriefcase color="#3182CE" />
                  <Text fontWeight="bold" fontSize="lg">
                    Руководство:
                  </Text>
                </HStack>

                <VStack align="start">
                  <Box>
                    <HStack>
                      <FaUser color="#718096" />
                      <Text fontWeight="semibold">Директор</Text>
                    </HStack>
                    <Text>Симон Лариса Геннадьевна</Text>
                    <Text color="blue.600">тел.: +7 (40161) 3-35-60</Text>
                  </Box>

                  <Box>
                    <HStack>
                      <FaUser color="#718096" />
                      <Text fontWeight="semibold">Главный бухгалтер</Text>
                    </HStack>
                    <Text>Шалунова Анжела Витальевна</Text>
                    <Text color="blue.600">тел.: +7 (40161) 3-28-24</Text>
                  </Box>

                  <Box>
                    <HStack>
                      <FaUser color="#718096" />
                      <Text fontWeight="semibold">
                        Заместитель директора по АХЧ
                      </Text>
                    </HStack>
                    <Text>Корныхина Светлана Владимировна</Text>
                    <Text color="blue.600">тел.: +7 (40161) 3-28-24</Text>
                  </Box>

                  <Box>
                    <HStack>
                      <FaUser color="#718096" />
                      <Text fontWeight="semibold">Методический кабинет</Text>
                    </HStack>
                    <Text>
                      Заместитель директора: Костикова Татьяна Николаевна
                    </Text>
                    <Text>Методист: Дзнеладзе Манана Элдаровна</Text>
                    <Text>
                      Художественный руководитель: Сорокина Анастасия Андреевна
                    </Text>
                    <Text color="blue.600">тел.: +7 (40161) 3-46-80</Text>
                  </Box>

                  <Box>
                    <HStack>
                      <FaUser color="#718096" />
                      <Text fontWeight="semibold">
                        Администратор/продажа билетов
                      </Text>
                    </HStack>
                    <Text color="blue.600">тел.: +7 901 963 20 63</Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </VStack>
    </Container>
  );
}
