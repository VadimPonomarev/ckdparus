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
  date: Date;
  location?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface PosterGridProps {
  showTitle?: boolean;
  showFeaturedOnly?: boolean;
  futureOnly?: boolean;
  initialLimit?: number; // Сколько загружать изначально
  loadMoreCount?: number; // Сколько дозагружать при клике
}

const PosterGrid: React.FC<PosterGridProps> = ({
  showTitle = true,
  showFeaturedOnly = true,
  futureOnly = true,
  initialLimit = 16,
  loadMoreCount = 16,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: initialLimit.toString(),
          offset: '0',
        });

        if (showFeaturedOnly) params.append('featured', 'true');
        if (futureOnly) params.append('future', 'true');

        const response = await fetch(`/api/events?${params}`);
        if (!response.ok) throw new Error('Ошибка загрузки мероприятий');

        const data = await response.json();
        setEvents(data);
        setDisplayedEvents(data);
        setHasMore(data.length === initialLimit); // Если вернулось меньше чем limit, значит больше нет
        setOffset(initialLimit);
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

      const params = new URLSearchParams({
        limit: loadMoreCount.toString(),
        offset: offset.toString(),
      });

      if (showFeaturedOnly) params.append('featured', 'true');
      if (futureOnly) params.append('future', 'true');

      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) throw new Error('Ошибка загрузки мероприятий');

      const newEvents = await response.json();

      if (newEvents.length > 0) {
        setDisplayedEvents(prev => [...prev, ...newEvents]);
        setOffset(prev => prev + newEvents.length);
        setHasMore(newEvents.length === loadMoreCount);
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
        <Center p={10}>
          <Text color="red.500">{error}</Text>
        </Center>
      </Stack>
    );
  }

  if (displayedEvents.length === 0) {
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

      <SimpleGrid columns={[1, 2, 3, 4]} gap={4}>
        {displayedEvents.map(event => (
          <PosterCard
            key={event.id}
            id={event.id}
            title={event.title}
            date={event.date}
            imageUrl={event.imageUrl}
            briefdescription={event.briefdescription}
            location={event.location}
            price={event.price}
            category={event.category}
            linkUrl={`/events/${event.id}`}
          />
        ))}
      </SimpleGrid>

      {hasMore && (
        <Center pt={4} pb={8}>
          <Button
            onClick={handleLoadMore}
            loadingText="Загрузка..."
            colorScheme="blue"
            size="lg"
            px={8}
          >
            Показать еще
          </Button>
        </Center>
      )}

      {!hasMore && displayedEvents.length > 0 && (
        <Center pt={2} pb={4}>
          <Text color="gray.500" fontSize="sm">
            Загружены все мероприятия
          </Text>
        </Center>
      )}
    </Stack>
  );
};

export default PosterGrid;
