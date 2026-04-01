import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  Separator,
  Center,
  Skeleton,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import PosterCard from './postercard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Тип события из Prisma
interface Event {
  id: string;
  title: string;
  briefdescription?: string;
  fulldescription?: string;
  date: string;
  location?: string;
  priceFrom?: number;
  priceTo?: number;
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
  useTestData?: boolean;
  hideNavigationOnMobile?: boolean;
}

const Poster: React.FC<PosterProps> = ({
  showTitle = true,
  showFeaturedOnly = true,
  maxVisibleItems = 5,
  limit = 10,
  futureOnly = true,
  hideNavigationOnMobile = true,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Определяем, является ли устройство мобильным
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Определяем, показывать ли навигацию
  const showNavigation = !(hideNavigationOnMobile && isMobile);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (showFeaturedOnly) params.append('featured', 'false');

        const itemsToFetch = Math.max(limit, maxVisibleItems + 5);
        params.append('limit', itemsToFetch.toString());
        params.append('offset', '0');

        if (futureOnly) params.append('future', 'true');

        const response = await fetch(`/api/events?${params}`);
        if (!response.ok) throw new Error('Ошибка загрузки мероприятий');

        const data: ApiResponse = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [showFeaturedOnly, limit, futureOnly, maxVisibleItems]);

  const filteredEvents = events;

  if (loading) {
    return (
      <Stack width="100%" pt={10}>
        {showTitle && (
          <>
            <Skeleton height="40px" width="150px" mb={2} />
            <Separator />
          </>
        )}
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            1024: { slidesPerView: maxVisibleItems },
          }}
          className="events-swiper"
        >
          {[...Array(maxVisibleItems)].map((_, i) => (
            <SwiperSlide key={i}>
              <Skeleton height="350px" borderRadius="md" />
            </SwiperSlide>
          ))}
        </Swiper>
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
        <Center p={10}>
          <Text color="red.500">Ошибка: {error}</Text>
        </Center>
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

      <Box width="100%" pt={4}>
        <Swiper
          cssMode={true}
          navigation={showNavigation}
          pagination={true}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            1024: {
              slidesPerView: maxVisibleItems,
              slidesPerGroup: maxVisibleItems,
            },
          }}
          className="events-swiper"
          style={{
            padding: showNavigation ? '4px 0 30px 0' : '0 0 30px 0',
          }}
        >
          {filteredEvents.map(event => (
            <SwiperSlide key={event.id}>
              <PosterCard
                id={event.id}
                title={event.title}
                date={new Date(event.date)}
                imageUrl={event.imageUrl}
                briefdescription={event.briefdescription}
                location={event.location}
                priceFrom={event.priceFrom}
                priceTo={event.priceTo}
                category={event.category}
                linkUrl={`/events/${event.id}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Stack>
  );
};

export default Poster;
