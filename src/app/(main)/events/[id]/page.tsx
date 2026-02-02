// src/app/(main)/events/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EventDetailCard from '@/components/eventdetailcard/eventdetailcard';
import { Spinner, Center, Box } from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';

// Тип для данных события
interface EventData {
  id: string;
  title: string;
  date: Date;
  imageUrl?: string;
  description: string;
  location: string;
  address?: string;
  price?: number;
  category?: string;
  organizer?: string;
  organizerContacts?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  tags?: string[];
  socialLinks?: {
    instagram?: string;
    vk?: string;
    telegram?: string;
  };
}

const EventPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных события по ID
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Вызов вашего API для получения события по ID
        const response = await fetch(`/api/events/${id}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Ошибка ${response.status}`);
        }

        const data = await response.json();

        // Преобразуем данные, если нужно
        setEventData({
          ...data,
          date: new Date(data.date), // Преобразуем строку в Date объект
        });
      } catch (err) {
        console.error('Ошибка загрузки события:', err);
        setError(
          err instanceof Error ? err.message : 'Не удалось загрузить событие'
        );

        toaster.create({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные события',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Обработчик регистрации
  const handleRegister = async () => {
    try {
      // Вызов API для регистрации на событие
      const response = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ userId: 'current-user-id' }) // если нужно
      });

      if (!response.ok) {
        throw new Error('Ошибка регистрации');
      }

      const result = await response.json();

      toaster.create({
        title: 'Успешно!',
        description:
          result.message || 'Вы успешно зарегистрировались на мероприятие',
        type: 'success',
      });

      // Обновляем данные о текущих участниках
      if (eventData && eventData.currentParticipants !== undefined) {
        setEventData({
          ...eventData,
          currentParticipants: eventData.currentParticipants + 1,
        });
      }
    } catch (err) {
      toaster.create({
        title: 'Ошибка',
        description:
          err instanceof Error ? err.message : 'Не удалось зарегистрироваться',
        type: 'error',
      });
    }
  };

  // Обработчик добавления в избранное
  const handleBookmark = async () => {
    try {
      // Вызов API для добавления в избранное
      const response = await fetch(`/api/events/${id}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ userId: 'current-user-id' })
      });

      if (!response.ok) {
        throw new Error('Ошибка добавления в избранное');
      }

      const result = await response.json();

      toaster.create({
        title: 'Успешно!',
        description: result.message || 'Событие добавлено в избранное',
        type: 'success',
      });
    } catch (err) {
      toaster.create({
        title: 'Ошибка',
        description:
          err instanceof Error
            ? err.message
            : 'Не удалось добавить в избранное',
        type: 'error',
      });
    }
  };

  // Состояние загрузки
  if (loading) {
    return (
      <Center minH="60vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" mb={4} />
          <Text color="gray.600">Загрузка события...</Text>
        </Box>
      </Center>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <Center minH="60vh" p={4}>
        <Heading size="md" mb={2}>
          Ошибка загрузки
        </Heading>
      </Center>
    );
  }

  // Событие не найдено
  if (!eventData) {
    return (
      <Center minH="60vh" p={4}>
        <Heading size="md" mb={2}>
          Событие не найдено
        </Heading>
        <Text>Запрошенное событие не существует или было удалено</Text>
      </Center>
    );
  }

  // Успешная загрузка - отображаем компонент
  return (
    <EventDetailCard
      {...eventData}
      onRegister={handleRegister}
      onBookmark={handleBookmark}
    />
  );
};

// Добавляем импорт Heading если нужно
import { Heading, Text, Button } from '@chakra-ui/react';

export default EventPage;
