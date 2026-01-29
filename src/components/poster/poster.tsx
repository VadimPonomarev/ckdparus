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
  Alert,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import PosterCard from './postercard';

// Тип события из Prisma
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

interface PosterProps {
  showTitle?: boolean;
  showFeaturedOnly?: boolean;
  maxVisibleItems?: number;
  limit?: number;
  futureOnly?: boolean;
}

const Poster: React.FC<PosterProps> = ({
  showTitle = true,
  showFeaturedOnly = true, // По умолчанию показываем избранные
  maxVisibleItems = 5,
  limit = 10,
  futureOnly = true, // По умолчанию только будущие события
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Получаем данные
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Параметры запроса
        const params = new URLSearchParams();
        if (showFeaturedOnly) params.append('featured', 'true');
        if (limit) params.append('limit', limit.toString());
        if (futureOnly) params.append('future', 'false');

        const response = await fetch(`/api/events?${params}`);

        if (!response.ok) {
          throw new Error('Ошибка загрузки мероприятий');
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [showFeaturedOnly, limit, futureOnly]);

  // Фильтрация событий (на случай если нужна дополнительная фильтрация на клиенте)
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

  // Лоадер
  if (loading) {
    return (
      <Stack width="100%">
        {showTitle && (
          <>
            <Skeleton height="40px" width="150px" mb={2} />
            <Separator />
          </>
        )}
        <SimpleGrid columns={[1, 2, 3, 5]} mt={4}>
          {[...Array(maxVisibleItems)].map((_, i) => (
            <Skeleton key={i} height="350px" borderRadius="md" />
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  // Ошибка
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
        <Text mt={4}>{error}</Text>
      </Stack>
    );
  }

  // Если нет событий
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

  // Если не нужно показывать слайдер (мало событий)
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
        <SimpleGrid columns={[1, 2, 3, 5]} width="100%">
          {filteredEvents.map(event => (
            <PosterCard
              id={event.id}
              key={event.id}
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
        {/* Кнопка назад */}
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

        {/* Контейнер для слайдера */}
        <Box
          ref={sliderRef}
          width="100%"
          overflow="hidden"
          position="relative"
          flex="1"
        >
          <HStack width="100%" justify="space-between">
            {visibleItems.map(event => (
              <Box key={event.id} flex="1" minW="200px">
                <PosterCard
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
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Кнопка вперед */}
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

      {/* Индикатор прогресса */}
      {totalItems > maxVisibleItems && (
        <HStack justify="center" mt={4}>
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
