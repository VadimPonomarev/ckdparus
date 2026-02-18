import { useState, useRef, useEffect } from 'react';
import {
  HStack,
  Separator,
  Stack,
  Text,
  IconButton,
  Box,
  SimpleGrid,
  Center,
  Skeleton,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import NewsCard from './newscard';

// Тип новости из Prisma
interface News {
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

interface NewsListProps {
  showTitle?: boolean;
  showPublishedOnly?: boolean;
  showFeaturedOnly?: boolean;
  maxVisibleItems?: number;
  limit?: number;
}

const NewsList: React.FC<NewsListProps> = ({
  showTitle = true,
  showPublishedOnly = true,
  showFeaturedOnly = false,
  maxVisibleItems = 5,
  limit = 10,
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (showPublishedOnly) params.append('published', 'true');
        if (showFeaturedOnly) params.append('featured', 'true');
        if (limit) params.append('limit', limit.toString());

        const response = await fetch(`/api/news?${params}`);
        if (!response.ok) throw new Error('Ошибка загрузки новостей');

        const data = await response.json();
        setNews(data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [showPublishedOnly, showFeaturedOnly, limit]);

  const filteredNews = news;
  const totalItems = filteredNews.length;
  const showSlider = totalItems > maxVisibleItems;

  const handleNext = () => {
    if (currentIndex < totalItems - maxVisibleItems) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const visibleItems = filteredNews.slice(
    currentIndex,
    currentIndex + maxVisibleItems
  );

  if (loading) {
    return (
      <Stack width="100%" pt={10}>
        {showTitle && (
          <>
            <Skeleton height="40px" width="150px" mb={2} />
            <Separator />
          </>
        )}
        <SimpleGrid columns={[1, 2, 3, 5]} gap={4} mt={4}>
          {[...Array(maxVisibleItems)].map((_, i) => (
            <Skeleton key={i} height="350px" borderRadius="md" />
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack width="100%">
        {showTitle && (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              Новости
            </Text>
            <Separator />
          </>
        )}
        <Center p={10}>
          <Text color="red.500">Ошибка: {error}</Text>
        </Center>
      </Stack>
    );
  }

  if (filteredNews.length === 0) {
    return (
      <Stack width="100%">
        {showTitle && (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              Новости
            </Text>
            <Separator />
          </>
        )}
        <Center p={10}>
          <Text color="gray.500">Нет новостей</Text>
        </Center>
      </Stack>
    );
  }

  if (!showSlider) {
    return (
      <Stack width="100%">
        {showTitle && (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              Новости
            </Text>
            <Separator />
          </>
        )}
        <SimpleGrid columns={[1, 2, 3, 5]} gap={4} width="100%">
          {filteredNews.map(item => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.title}
              date={item.createdAt}
              content={item.content}
              excerpt={item.excerpt}
              imageUrl={item.imageUrl}
              views={item.views}
              linkUrl={`/news/${item.id}`}
            />
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  return (
    <Stack width="100%" position="relative">
      {showTitle && (
        <>
          <Text fontSize="2xl" fontWeight="bold">
            Новости
          </Text>
          <Separator bgColor="whiteAlpha.500" />
        </>
      )}

      <HStack width="100%" justify="space-between" align="center">
        <IconButton
          aria-label="Предыдущие новости"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          variant="ghost"
          size="lg"
          visibility={currentIndex === 0 ? 'hidden' : 'visible'}
          opacity={currentIndex === 0 ? 0 : 1}
          transition="all 0.2s ease"
        >
          <FaChevronLeft />
        </IconButton>

        <Box
          ref={sliderRef}
          width="100%"
          overflow="hidden"
          position="relative"
          flex="1"
          display="flex"
          gap="16px"
          justifyContent="space-between"
        >
          {visibleItems.map(item => (
            <Box key={item.id} flex="1" minW="200px">
              <NewsCard
                id={item.id}
                title={item.title}
                date={item.createdAt}
                content={item.content}
                excerpt={item.excerpt}
                imageUrl={item.imageUrl}
                views={item.views}
                linkUrl={`/news/${item.id}`}
              />
            </Box>
          ))}
        </Box>

        <IconButton
          aria-label="Следующие новости"
          onClick={handleNext}
          disabled={currentIndex >= totalItems - maxVisibleItems}
          variant="ghost"
          size="lg"
          visibility={
            currentIndex >= totalItems - maxVisibleItems ? 'hidden' : 'visible'
          }
          opacity={currentIndex >= totalItems - maxVisibleItems ? 0 : 1}
          transition="all 0.2s ease"
        >
          <FaChevronRight />
        </IconButton>
      </HStack>

      {totalItems > maxVisibleItems && (
        <HStack justify="center" mt={4} gap={2}>
          {Array.from({ length: totalItems - maxVisibleItems + 1 }).map(
            (_, index) => (
              <Box
                key={index}
                width="8px"
                height="8px"
                borderRadius="full"
                bg={index === currentIndex ? 'blue.500' : 'gray.300'}
                cursor="pointer"
                onClick={() => setCurrentIndex(index)}
                _hover={{
                  bg: index === currentIndex ? 'blue.600' : 'gray.400',
                  transform: 'scale(1.2)',
                }}
                transition="all 0.2s ease"
              />
            )
          )}
        </HStack>
      )}
    </Stack>
  );
};

export default NewsList;
