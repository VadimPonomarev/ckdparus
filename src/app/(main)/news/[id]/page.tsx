// app/(main)/news/[id]/page.tsx
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
  Container,
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import NewsDetailCard from '@/components/news/newsdetailcard';
import { useAuth } from '@/contexts/AuthContext';

// Тип для данных новости (соответствует API)
interface NewsImage {
  id: string;
  url: string;
  alt?: string | null;
  caption?: string | null;
  order: number;
}

interface NewsData {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  images?: NewsImage[];
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

  // Обработчик удаления
  const handleDelete = () => {
    router.push('/news');
  };

  // Состояние загрузки
  if (loading) {
    return (
      <Container maxW="1200px" py={8}>
        <Center minH="60vh">
          <VStack>
            <Spinner size="xl" color="blue.500" />
            <Text color="gray.600">Загрузка новости...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <Container maxW="1200px" py={8}>
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
      </Container>
    );
  }

  // Новость не найдена
  if (!newsData) {
    return (
      <Container maxW="1200px" py={8}>
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
      </Container>
    );
  }

  // Проверка на публикацию (если пользователь не админ)
  if (!newsData.isPublished && !isAuthenticated) {
    return (
      <Container maxW="1200px" py={8}>
        <Center minH="60vh">
          <VStack p={4}>
            <Heading size="md">Новость не опубликована</Heading>
            <Text color="gray.600" textAlign="center">
              Эта новость находится в черновике и доступна только
              администраторам
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
      </Container>
    );
  }

  // Преобразуем данные для передачи в компонент
  const formattedNewsData = {
    ...newsData,
    excerpt: newsData.excerpt || undefined,
    videoUrl: newsData.videoUrl || undefined,
    imageUrl: newsData.imageUrl || undefined,
    images: newsData.images?.map(img => ({
      ...img,
      alt: img.alt || undefined,
      caption: img.caption || undefined,
    })),
  };

  // Успешная загрузка - отображаем компонент
  return (
    <NewsDetailCard
      id={formattedNewsData.id}
      title={formattedNewsData.title}
      content={formattedNewsData.content}
      excerpt={formattedNewsData.excerpt}
      videoUrl={formattedNewsData.videoUrl}
      imageUrl={formattedNewsData.imageUrl}
      isPublished={formattedNewsData.isPublished}
      views={formattedNewsData.views}
      createdAt={new Date(formattedNewsData.createdAt)}
      updatedAt={new Date(formattedNewsData.updatedAt)}
      images={formattedNewsData.images}
    />
  );
};

export default NewsPage;
