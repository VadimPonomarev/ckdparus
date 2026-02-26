// app/news/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Spinner,
  Center,
  Box,
  Text,
  Heading,
  Button,
  VStack,
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import NewsDetailCard from '@/components/news/newsdetailcard';
import { useAuth } from '@/contexts/AuthContext';

// Тип для данных новости (соответствует API)
interface NewsData {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  images?: Array<{
    id: string;
    url: string;
    alt?: string | null;
    caption?: string | null;
    order: number;
  }>;
}

const NewsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
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
          if (response.status === 404) {
            throw new Error('Новость не найдена');
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Ошибка ${response.status}`);
        }

        const data: NewsData = await response.json();
        setNewsData(data);
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

  // Обработчик редактирования
  const handleEdit = () => {
    router.push(`/admin/news/edit/${id}`);
  };

  // Обработчик удаления
  const handleDelete = () => {
    router.push('/news');
  };

  // Состояние загрузки
  if (loading) {
    return (
      <Center minH="60vh">
        <VStack>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Загрузка новости...</Text>
        </VStack>
      </Center>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <Center minH="60vh">
        <VStack p={4}>
          <Heading size="md" color="red.500">
            {error}
          </Heading>
          <Button
            onClick={() => router.push('/news')}
            colorScheme="blue"
            size="lg"
          >
            Вернуться к списку новостей
          </Button>
        </VStack>
      </Center>
    );
  }

  // Новость не найдена
  if (!newsData) {
    return (
      <Center minH="60vh">
        <VStack p={4}>
          <Heading size="md">Новость не найдена</Heading>
          <Text color="gray.600">
            Запрошенная новость не существует или была удалена
          </Text>
          <Button
            onClick={() => router.push('/news')}
            colorScheme="blue"
            size="lg"
          >
            Вернуться к списку новостей
          </Button>
        </VStack>
      </Center>
    );
  }

  // Проверка на публикацию (если пользователь не админ)
  if (!newsData.isPublished && !isAuthenticated) {
    return (
      <Center minH="60vh">
        <VStack p={4}>
          <Heading size="md">Новость не опубликована</Heading>
          <Text color="gray.600" textAlign="center">
            Эта новость находится в черновике и доступна только администраторам
          </Text>
          <Button
            onClick={() => router.push('/news')}
            colorScheme="blue"
            size="lg"
          >
            Вернуться к списку новостей
          </Button>
        </VStack>
      </Center>
    );
  }

  // Успешная загрузка - отображаем компонент
  return (
    <NewsDetailCard
      id={newsData.id}
      title={newsData.title}
      content={newsData.content}
      excerpt={newsData.excerpt}
      imageUrl={newsData.imageUrl}
      isPublished={newsData.isPublished}
      views={newsData.views}
      createdAt={new Date(newsData.createdAt)}
      updatedAt={new Date(newsData.updatedAt)}
      images={newsData.images}
      onBookmark={handleBookmark}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default NewsPage;
