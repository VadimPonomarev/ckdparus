import { useState, useRef } from 'react';
import {
  HStack,
  Separator,
  Stack,
  Text,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import NewsCard from './newscard';

const NEWS_DATA = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Новость ${i + 1}: Важное событие в культурной жизни города`,
  date: `${i + 1} января 2026`,
  image: 'HeaderPicture.jpg',
  description: `Краткое описание новости ${i + 1}. Это значимое событие в культурной жизни нашего города, которое заслуживает внимания.`,
}));

const News = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const totalItems = NEWS_DATA.length;
  const maxVisibleItems = 5;
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

  const visibleItems = NEWS_DATA.slice(
    currentIndex,
    currentIndex + maxVisibleItems
  );

  // Если не нужно показывать слайдер
  if (!showSlider) {
    return (
      <Stack width="100%">
        <Text fontSize="2xl" fontWeight="bold">
          Новости
        </Text>
        <Separator />
        <HStack width="100%" justify="space-between">
          {NEWS_DATA.map(item => (
            <NewsCard
              key={item.id}
              title={item.title}
              date={item.date}
              image={item.image}
              description={item.description}
            />
          ))}
        </HStack>
      </Stack>
    );
  }

  return (
    <Stack width="100%" position="relative">
      <Text fontSize="2xl" fontWeight="bold">
        Новости
      </Text>
      <Separator />

      <HStack width="100%" justify="space-between" align="center">
        {/* Кнопка назад */}
        <IconButton
          aria-label="Предыдущие новости"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          variant="ghost"
          size="lg"
          _hover={{ bg: 'gray.100' }}
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
          <HStack width="100%" justify="space-between" p={5}>
            {visibleItems.map(item => (
              <Box key={item.id}>
                <NewsCard
                  title={item.title}
                  date={item.date}
                  image={item.image}
                  description={item.description}
                />
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Кнопка вперед */}
        <IconButton
          aria-label="Следующие новости"
          onClick={handleNext}
          disabled={currentIndex >= totalItems - maxVisibleItems}
          variant="ghost"
          size="lg"
          _hover={{ bg: 'gray.100' }}
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
      <HStack justify="center">
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
    </Stack>
  );
};

export default News;
