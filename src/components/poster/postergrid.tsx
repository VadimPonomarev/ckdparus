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
import PosterCard from './postercard';

interface Event {
  id: string;
  title: string;
  briefdescription?: string;
  fulldescription?: string;
  date: string; // ИЗМЕНЕНО: API возвращает строку
  location?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface ApiResponse {
  events: Event[];
  totalCount: number;
  hasMore: boolean;
}

interface PosterGridProps {
  showTitle?: boolean;
  showFeaturedOnly?: boolean;
  futureOnly?: boolean;
  initialLimit?: number;
  loadMoreCount?: number;
}

const PosterGrid: React.FC<PosterGridProps> = ({
  showTitle = true,
  showFeaturedOnly = true,
  futureOnly = true,
  initialLimit = 16,
  loadMoreCount = 16,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          limit: initialLimit.toString(),
          offset: '0',
        });

        if (showFeaturedOnly) params.append('featured', 'true');
        if (futureOnly) params.append('future', 'true');

        const response = await fetch(`/api/events?${params}`);
        if (!response.ok) throw new Error('Ошибка загрузки мероприятий');

        const data: ApiResponse = await response.json();

        // ИСПРАВЛЕНО: data.events - это массив, а не data
        setEvents(data.events || []);
        setHasMore(data.hasMore);
        setTotalCount(data.totalCount);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [showFeaturedOnly, futureOnly, initialLimit]);

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      setError(null);

      const params = new URLSearchParams({
        limit: loadMoreCount.toString(),
        offset: events.length.toString(), // ИСПРАВЛЕНО: используем events.length
      });

      if (showFeaturedOnly) params.append('featured', 'true');
      if (futureOnly) params.append('future', 'true');

      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) throw new Error('Ошибка загрузки мероприятий');

      const data: ApiResponse = await response.json();

      // ИСПРАВЛЕНО: data.events - это массив
      if (data.events && data.events.length > 0) {
        setEvents(prev => [...prev, ...data.events]);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more events:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке');
    } finally {
      setLoadingMore(false);
    }
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
        <SimpleGrid columns={[1, 2, 3, 4]} gap={4} mt={4}>
          {[...Array(initialLimit)].map((_, i) => (
            <Skeleton key={i} height="350px" borderRadius="md" />
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
              Все мероприятия
            </Text>
            <Separator />
          </>
        )}

        <Text>{error}</Text>

        <Center>
          <Button
            onClick={() => window.location.reload()}
            colorScheme="blue"
            size="sm"
            mt={4}
          >
            Попробовать снова
          </Button>
        </Center>
      </Stack>
    );
  }

  if (events.length === 0) {
    return (
      <Stack width="100%" pt={10}>
        {showTitle && (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              Все мероприятия
            </Text>
            <Separator />
          </>
        )}
        <Center p={10}>
          <Text color="gray.500">Нет доступных мероприятий</Text>
        </Center>
      </Stack>
    );
  }

  return (
    <Stack width="100%" pt={10}>
      {showTitle && (
        <>
          <Text fontSize="2xl" fontWeight="bold">
            Все мероприятия
          </Text>
          <Separator />
        </>
      )}

      <Box>
        <SimpleGrid columns={[1, 2, 3, 4]} gap={4}>
          {events.map(event => (
            <PosterCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={new Date(event.date)} // ИЗМЕНЕНО: преобразуем строку в Date
              imageUrl={event.imageUrl}
              briefdescription={event.briefdescription}
              location={event.location}
              price={event.price}
              category={event.category}
              linkUrl={`/events/${event.id}`}
            />
          ))}
        </SimpleGrid>

        {/* Индикатор загрузки */}
        {loadingMore && (
          <SimpleGrid columns={[1, 2, 3, 4]} gap={4} mt={4}>
            {[...Array(loadMoreCount)].map((_, i) => (
              <Skeleton key={`loading-${i}`} height="350px" borderRadius="md" />
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

      {!hasMore && events.length > 0 && (
        <Center pt={2} pb={4}>
          <Text color="gray.500" fontSize="sm">
            Загружено {events.length} из {totalCount} мероприятий
          </Text>
        </Center>
      )}
    </Stack>
  );
};

export default PosterGrid;
