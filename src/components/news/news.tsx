import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  Separator,
  Center,
  Skeleton,
  Box,
  useBreakpointValue, // Добавляем хук для определения размера экрана
} from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import NewsCard from './newscard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Тип новости из Prisma (соответствует API)
interface News {
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

interface ApiResponse {
  news: News[];
  totalCount: number;
  hasMore: boolean;
}

interface NewsListProps {
  showTitle?: boolean;
  showPublishedOnly?: boolean;
  maxVisibleItems?: number;
  limit?: number;
  useTestData?: boolean;
  hideNavigationOnMobile?: boolean; // Новый пропс
}

const NewsList: React.FC<NewsListProps> = ({
  showTitle = true,
  showPublishedOnly = true,
  maxVisibleItems = 5,
  limit = 10,
  hideNavigationOnMobile = true, // По умолчанию скрываем на мобильных
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Определяем, является ли устройство мобильным
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Определяем, показывать ли навигацию
  const showNavigation = !(hideNavigationOnMobile && isMobile);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (showPublishedOnly) params.append('published', 'true');

        const itemsToFetch = Math.max(limit, maxVisibleItems + 5);
        params.append('limit', itemsToFetch.toString());
        params.append('offset', '0');

        const response = await fetch(`/api/news?${params}`);
        if (!response.ok) throw new Error('Ошибка загрузки новостей');

        const data: ApiResponse = await response.json();
        setNews(data.news || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [showPublishedOnly, limit, maxVisibleItems]);

  const filteredNews = showPublishedOnly
    ? news.filter(item => item.isPublished)
    : news;

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
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: maxVisibleItems },
          }}
          className="news-swiper"
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

      <Box width="100%" mt={4}>
        <Swiper
          cssMode={true}
          navigation={showNavigation} // Условное отображение навигации
          pagination={true}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            480: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1024: {
              slidesPerView: maxVisibleItems,
              slidesPerGroup: maxVisibleItems,
            },
          }}
          className="news-swiper"
          style={{
            padding: showNavigation ? '4px 0 30px 0' : '0 0 30px 0', // Убираем отступ для стрелок на мобильных
          }}
        >
          {filteredNews.map(item => (
            <SwiperSlide key={item.id}>
              <NewsCard
                id={item.id}
                title={item.title}
                date={new Date(item.createdAt)}
                content={item.content}
                excerpt={item.excerpt || undefined}
                imageUrl={item.imageUrl || undefined}
                views={item.views}
                isPublished={item.isPublished}
                linkUrl={`/news/${item.id}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Stack>
  );
};

export default NewsList;
