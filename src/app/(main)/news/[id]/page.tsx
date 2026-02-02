'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner, Center, Box, Text, Heading, Button } from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import NewsDetailCard from '@/components/news/newsdetailcard';

// Тип для данных новости
interface NewsData {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const NewsPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных новости по ID
  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/news/${id}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Ошибка ${response.status}`);
        }

        const data = await response.json();

        setNewsData({
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        });
      } catch (err) {
        console.error('Ошибка загрузки новости:', err);
        setError(
          err instanceof Error ? err.message : 'Не удалось загрузить новость'
        );

        toaster.create({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные новости',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  // Обработчик добавления в избранное
  const handleBookmark = async () => {
    try {
      // Здесь можно добавить API для добавления в избранное
      const response = await fetch(`/api/news/${id}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка добавления в избранное');
      }

      const result = await response.json();

      toaster.create({
        title: 'Успешно!',
        description: result.message || 'Новость добавлена в избранное',
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

  // Обработчик редактирования (если есть права)
  const handleEdit = () => {
    // Редирект на страницу редактирования
    window.location.href = `/admin/news/edit/${id}`;
  };

  // Состояние загрузки
  if (loading) {
    return (
      <Center minH="60vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" mb={4} />
          <Text color="gray.600">Загрузка новости...</Text>
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
        <Text color="gray.600" mb={4}>
          {error}
        </Text>
        <Button
          onClick={() => window.location.reload()}
          colorScheme="blue"
          size="sm"
        >
          Попробовать снова
        </Button>
      </Center>
    );
  }

  // Новость не найдена
  if (!newsData) {
    return (
      <Center minH="60vh" p={4}>
        <Heading size="md" mb={2}>
          Новость не найдена
        </Heading>
        <Text color="gray.600">
          Запрошенная новость не существует или была удалена
        </Text>
      </Center>
    );
  }

  // Проверка на публикацию (если пользователь не админ)
  if (!newsData.isPublished) {
    return (
      <Center minH="60vh" p={4}>
        <Heading size="md" mb={2}>
          Новость не опубликована
        </Heading>
        <Text color="gray.600">
          Эта новость находится в черновике и недоступна для просмотра
        </Text>
      </Center>
    );
  }

  // Успешная загрузка - отображаем компонент
  return (
    <NewsDetailCard
      {...newsData}
      onBookmark={handleBookmark}
      onEdit={handleEdit}
    />
  );
};

export default NewsPage;
