// components/news/newsgrid.tsx
'use client';
import { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  SimpleGrid,
  Center,
  Skeleton,
  Button,
  Separator,
  Box,
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import NewsCard from './newscard';

interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  images?: Array<{
    id: string;
    url: string;
    alt?: string | null;
    caption?: string | null;
    order: number;
  }>;
}

interface ApiResponse {
  news: News[];
  totalCount: number;
  hasMore: boolean;
}

interface NewsGridProps {
  showTitle?: boolean;
  publishedOnly?: boolean;
  initialLimit?: number;
  loadMoreCount?: number;
}

const NewsGrid: React.FC<NewsGridProps> = ({
  showTitle = true,
  publishedOnly = true,
  initialLimit = 12,
  loadMoreCount = 12,
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          limit: initialLimit.toString(),
          offset: '0',
        });

        if (publishedOnly) params.append('published', 'true');

        const response = await fetch(`/api/news?${params}`);
        if (!response.ok) throw new Error('Ошибка загрузки новостей');

        const data: ApiResponse = await response.json();

        setNews(data.news || []);
        setHasMore(data.hasMore);
        setTotalCount(data.totalCount);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [publishedOnly, initialLimit]);

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      setError(null);

      const params = new URLSearchParams({
        limit: loadMoreCount.toString(),
        offset: news.length.toString(),
      });

      if (publishedOnly) params.append('published', 'true');

      const response = await fetch(`/api/news?${params}`);
      if (!response.ok) throw new Error('Ошибка загрузки новостей');

      const data: ApiResponse = await response.json();

      if (data.news && data.news.length > 0) {
        setNews(prev => [...prev, ...data.news]);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more news:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDeleteNews = (deletedId: string) => {
    setNews(prev => prev.filter(item => item.id !== deletedId));
    setTotalCount(prev => prev - 1);

    toaster.create({
      title: 'Новость удалена',
      type: 'success',
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <Stack width="100%" pt={10}>
        {showTitle && (
          <>
            <Skeleton height="40px" width="150px" mb={2} />
            <Separator />
          </>
        )}
        <SimpleGrid columns={[1, 2, 3]} gap={4} mt={4}>
          {[...Array(initialLimit)].map((_, i) => (
            <Skeleton key={i} height="400px" borderRadius="md" />
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack width="100%" pt={10}>
        {showTitle && (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              Новости
            </Text>
            <Separator />
          </>
        )}

        <Center p={10} flexDirection="column">
          <Text color="red.500" mb={4}>
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
      </Stack>
    );
  }

  if (news.length === 0) {
    return (
      <Stack width="100%" pt={10}>
        {showTitle && (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              Новости
            </Text>
            <Separator />
          </>
        )}
        <Center p={10}>
          <Text color="gray.500">Нет доступных новостей</Text>
        </Center>
      </Stack>
    );
  }

  return (
    <Stack width="100%" pt={10}>
      {showTitle && (
        <>
          <Text fontSize="2xl" fontWeight="bold">
            Новости
          </Text>
          <Separator />
        </>
      )}

      <Box>
        <SimpleGrid columns={[1, 2, 3]} gap={4}>
          {news.map(item => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.title}
              date={new Date(item.createdAt)}
              content={item.content}
              excerpt={item.excerpt || undefined}
              imageUrl={item.imageUrl || undefined}
              views={item.views}
              isPublished={item.isPublished}
              linkUrl={`/news/${item.id}`}
              onDelete={handleDeleteNews}
            />
          ))}
        </SimpleGrid>

        {/* Индикатор загрузки */}
        {loadingMore && (
          <SimpleGrid columns={[1, 2, 3]} gap={4} mt={4}>
            {[...Array(loadMoreCount)].map((_, i) => (
              <Skeleton key={`loading-${i}`} height="400px" borderRadius="md" />
            ))}
          </SimpleGrid>
        )}
      </Box>

      {hasMore && !loadingMore && (
        <Center pt={4} pb={8}>
          <Button
            onClick={handleLoadMore}
            loadingText="Загрузка..."
            colorScheme="blue"
            size="lg"
            px={8}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            transition="all 0.2s"
          >
            Показать еще
          </Button>
        </Center>
      )}

      {!hasMore && news.length > 0 && (
        <Center pt={2} pb={4}>
          <Text color="gray.500" fontSize="sm">
            Загружено {news.length} из {totalCount} новостей
          </Text>
        </Center>
      )}
    </Stack>
  );
};

export default NewsGrid;
