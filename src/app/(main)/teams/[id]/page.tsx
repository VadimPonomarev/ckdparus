// app/teams/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Text,
  VStack,
  HStack,
  Image,
  Container,
  Spinner,
  Center,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FaCalendarAlt,
  FaAward,
  FaUserTie,
  FaUsers,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaMusic,
  FaTrophy,
  FaClock,
} from 'react-icons/fa';

type Team = {
  id: string;
  name: string;
  description: string | null;
  foundationDate: string | null;
  titleAwardDate: string | null;
  lastConfirmation: string | null;
  confirmationOrder: string | null;
  leaderName: string | null;
  leaderNameSecondary: string | null;
  participantsAge: string | null;
  participantsGender: string | null;
  participantsCount: string | null;
  content: string | null;
  achievements: string | null;
  repertoire: string | null;
  schedule: string | null;
  imageUrl: string | null;
  category: string | null;
  subcategory: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
};

export default function TeamPage() {
  const params = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);

  // Получаем ID из параметров с учетом того, что это может быть промис
  useEffect(() => {
    async function getTeamId() {
      if (!params) {
        setError('Параметры не загружены');
        return;
      }

      try {
        let id = '';
        id = (params as { id?: string }).id || '';

        if (!id) {
          throw new Error('ID коллектива не указан');
        }

        setTeamId(id);
      } catch (err) {
        setError('Ошибка получения ID коллектива');
        console.error('Error getting team ID:', err);
      }
    }

    getTeamId();
  }, [params]);

  // Загружаем данные коллектива
  useEffect(() => {
    async function fetchTeam() {
      if (!teamId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/teams/${teamId}`);

        if (!response.ok) {
          throw new Error('Коллектив не найден');
        }

        const data = await response.json();
        setTeam(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, [teamId]);

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error || !team) {
    return (
      <Center h="50vh">
        <Text color="red.500" fontSize="xl">
          {error || 'Коллектив не найден'}
        </Text>
      </Center>
    );
  }

  return (
    <Center maxW="container.xl" py={8}>
      <VStack align="stretch">
        {/* Заголовок и категория */}
        <Box>
          <HStack justify="space-between" align="start" mb={4}>
            <Box>
              <Text fontSize="3xl" fontWeight="bold" color="blue.700">
                {team.name}
              </Text>

              <HStack mt={2}>
                {team.category && (
                  <Text fontSize="md" px={3} py={1}>
                    {team.category}
                  </Text>
                )}
                {team.subcategory && (
                  <Text fontSize="md" px={3} py={1}>
                    {team.subcategory}
                  </Text>
                )}
              </HStack>
            </Box>

            {team.imageUrl && (
              <Image
                src={team.imageUrl}
                alt={team.name}
                borderRadius="lg"
                boxSize="200px"
                objectFit="cover"
                boxShadow="lg"
              />
            )}
          </HStack>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }}>
          {/* Левая колонка - Основная информация */}
          <VStack align="stretch">
            {/* Блок с основными данными */}
            <Box p={6} borderRadius="lg">
              <Text fontSize="xl" fontWeight="bold" color="blue.700" mb={4}>
                Основная информация
              </Text>

              <VStack align="start">
                {team.foundationDate && (
                  <Box>
                    <HStack>
                      <FaCalendarAlt color="#3182CE" />
                      <Text fontWeight="bold">Дата основания:</Text>
                    </HStack>
                    <Text ml={6}>{team.foundationDate}</Text>
                  </Box>
                )}

                {team.titleAwardDate && (
                  <Box>
                    <HStack>
                      <FaAward color="#3182CE" />
                      <Text fontWeight="bold">Дата присвоения звания:</Text>
                    </HStack>
                    <Text ml={6}>{team.titleAwardDate}</Text>
                  </Box>
                )}

                {team.lastConfirmation && (
                  <Box>
                    <HStack>
                      <FaStar color="#3182CE" />
                      <Text fontWeight="bold">Подтверждение звания:</Text>
                    </HStack>
                    <Text ml={6}>{team.lastConfirmation}</Text>
                    {team.confirmationOrder && (
                      <Text ml={6} fontSize="sm" color="gray.600">
                        {team.confirmationOrder}
                      </Text>
                    )}
                  </Box>
                )}

                {team.leaderName && (
                  <Box>
                    <HStack>
                      <FaUserTie color="#3182CE" />
                      <Text fontWeight="bold">Руководитель коллектива:</Text>
                    </HStack>
                    <Text ml={6}>{team.leaderName}</Text>
                    {team.leaderNameSecondary && (
                      <Text ml={6}>{team.leaderNameSecondary}</Text>
                    )}
                  </Box>
                )}

                {team.participantsAge && (
                  <Box>
                    <HStack>
                      <FaUsers color="#3182CE" />
                      <Text fontWeight="bold">Участники:</Text>
                    </HStack>
                    <Text ml={6}>{team.participantsAge}</Text>
                    {team.participantsGender && (
                      <Text ml={6} fontSize="sm">
                        Пол: {team.participantsGender}
                      </Text>
                    )}
                    {team.participantsCount && (
                      <Text ml={6} fontSize="sm">
                        Количество: {team.participantsCount}
                      </Text>
                    )}
                  </Box>
                )}
              </VStack>
            </Box>

            {/* Контакты */}
            {(team.contactPhone || team.contactEmail) && (
              <Box p={6} borderRadius="lg">
                <Text fontSize="xl" fontWeight="bold" color="green.700" mb={4}>
                  Контакты
                </Text>

                <VStack align="start">
                  {team.contactPhone && (
                    <HStack>
                      <FaPhone color="#38A169" />
                      <Text>{team.contactPhone}</Text>
                    </HStack>
                  )}

                  {team.contactEmail && (
                    <HStack>
                      <FaEnvelope color="#38A169" />
                      <Text>{team.contactEmail}</Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            )}

            {/* Расписание */}
            {team.schedule && (
              <Box p={6} borderRadius="lg">
                <HStack mb={4}>
                  <FaClock color="#805AD5" />
                  <Text fontSize="xl" fontWeight="bold" color="purple.700">
                    Расписание занятий
                  </Text>
                </HStack>

                <Box whiteSpace="pre-line" pl={6}>
                  {team.schedule}
                </Box>
              </Box>
            )}
          </VStack>

          {/* Правая колонка - Описание и дополнительная информация */}
          <VStack align="stretch">
            {/* Краткая характеристика */}
            {team.content && (
              <Box p={6} borderRadius="lg">
                <Text fontSize="xl" fontWeight="bold" color="blue.700" mb={4}>
                  Краткая характеристика
                </Text>

                <Box whiteSpace="pre-line">{team.content}</Box>
              </Box>
            )}

            {/* Достижения */}
            {team.achievements && (
              <Box p={6} borderRadius="lg">
                <HStack mb={4}>
                  <FaTrophy color="#D69E2E" />
                  <Text fontSize="xl" fontWeight="bold" color="yellow.700">
                    Достижения
                  </Text>
                </HStack>

                <Box whiteSpace="pre-line" pl={6}>
                  {team.achievements}
                </Box>
              </Box>
            )}

            {/* Репертуар */}
            {team.repertoire && (
              <Box p={6} borderRadius="lg">
                <HStack mb={4}>
                  <FaMusic color="#E53E3E" />
                  <Text fontSize="xl" fontWeight="bold" color="red.700">
                    Репертуар
                  </Text>
                </HStack>

                <Box whiteSpace="pre-line" pl={6}>
                  {team.repertoire}
                </Box>
              </Box>
            )}
          </VStack>
        </SimpleGrid>
      </VStack>
    </Center>
  );
}
