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
import PosterCard from './postercard';

// Тип события из Prisma
interface Event {
  id: string;
  title: string;
  briefdescription?: string;
  fulldescription?: string;
  date: string; // ИЗМЕНЕНО: Date -> string (API возвращает строку)
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

interface PosterProps {
  showTitle?: boolean;
  showFeaturedOnly?: boolean;
  maxVisibleItems?: number;
  limit?: number;
  futureOnly?: boolean;
}

const Poster: React.FC<PosterProps> = ({
  showTitle = true,
  showFeaturedOnly = true,
  maxVisibleItems = 5,
  limit = 10,
  futureOnly = true,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        // ИЗМЕНЕНО: featured и future параметры
        if (showFeaturedOnly) params.append('featured', 'true'); // было 'false'
        if (limit) params.append('limit', limit.toString());
        if (futureOnly) params.append('future', 'true'); // было 'false'

        const response = await fetch(`/api/events?${params}`);
        if (!response.ok) throw new Error('Ошибка загрузки мероприятий');

        const data: ApiResponse = await response.json();
        // ИЗМЕНЕНО: получаем events из объекта ответа
        setEvents(data.events || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [showFeaturedOnly, limit, futureOnly]);

  const filteredEvents = events;
  const totalItems = filteredEvents.length;
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

  const visibleItems = filteredEvents.slice(
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
          {' '}
          {/* Исправлено: spacing → gap */}
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
              Афиша
            </Text>
            <Separator />
          </>
        )}
        {/* ИЗМЕНЕНО: добавляем Alert для ошибки */}

        <Text>{error}</Text>
      </Stack>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <Stack width="100%">
        {showTitle && (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              Афиша
            </Text>
            <Separator />
          </>
        )}
        <Center p={10}>
          <Text color="gray.500">Нет мероприятий</Text>
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
              Афиша
            </Text>
            <Separator />
          </>
        )}
        <SimpleGrid columns={[1, 2, 3, 5]} gap={4} width="100%">
          {' '}
          {/* Исправлено: spacing → gap */}
          {filteredEvents.map(event => (
            <PosterCard
              id={event.id}
              key={event.id}
              title={event.title}
              // ИЗМЕНЕНО: преобразуем строку в Date
              date={new Date(event.date)}
              imageUrl={event.imageUrl}
              briefdescription={event.briefdescription}
              location={event.location}
              price={event.price}
              category={event.category}
              linkUrl={`/events/${event.id}`}
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
            Афиша
          </Text>
          <Separator bgColor="whiteAlpha.500" />
        </>
      )}

      <HStack width="100%" justify="space-between" align="center">
        <IconButton
          aria-label="Предыдущие мероприятия"
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

        {/* Используем Box с display: flex и gap */}
        <Box
          ref={sliderRef}
          width="100%"
          overflow="hidden"
          position="relative"
          flex="1"
          display="flex"
          gap="16px" // Добавляем расстояние между карточками
          justifyContent="space-between"
        >
          {visibleItems.map(event => (
            <Box key={event.id} flex="1" minW="200px">
              <PosterCard
                id={event.id}
                title={event.title}
                // ИЗМЕНЕНО: преобразуем строку в Date
                date={new Date(event.date)}
                imageUrl={event.imageUrl}
                briefdescription={event.briefdescription}
                location={event.location}
                price={event.price}
                category={event.category}
                linkUrl={`/events/${event.id}`}
              />
            </Box>
          ))}
        </Box>

        <IconButton
          aria-label="Следующие мероприятия"
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
          {' '}
          {/* Добавлен gap */}
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

export default Poster;
