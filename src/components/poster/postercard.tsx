import { Center, Image, Link, Stack, Text, Box, Badge } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Типы для пропсов
interface PosterCardProps {
  id: string;
  title: string;
  date: Date;
  imageUrl?: string;
  alt?: string;
  briefdescription?: string;
  location?: string;
  price?: number;
  category?: string;
  linkUrl?: string;
  linkText?: string;
}

// Функция для получения цветовой схемы по категории
const getCategoryColorScheme = (category: string): string => {
  const categoryMap: Record<string, string> = {
    концерт: 'teal.500',
    выставка: 'green.500',
    спектакль: 'red.500',
    фестиваль: 'orange.500',
    'мастер-класс': 'blue.500',
    лекция: 'purple.500',
    конкурс: 'pink.500',
    другое: 'gray.500',
  };

  return categoryMap[category.toLowerCase()] || 'gray';
};

// Функция для получения русского названия категории
const getCategoryLabel = (categoryValue: string): string => {
  const categoryLabels: Record<string, string> = {
    концерт: 'Концерт',
    выставка: 'Выставка',
    спектакль: 'Спектакль',
    фестиваль: 'Фестиваль',
    'мастер-класс': 'Мастер-класс',
    лекция: 'Лекция',
    конкурс: 'Конкурс',
    другое: 'Другое',
  };

  return categoryLabels[categoryValue.toLowerCase()] || categoryValue;
};

const PosterCard: React.FC<PosterCardProps> = ({
  id,
  title,
  date,
  imageUrl,
  alt = title,
  briefdescription,
  location,
  price,
  category,
  linkUrl = `/events/${id}`,
  linkText = 'Подробнее',
}) => {
  // Форматирование даты
  const formattedDate = format(new Date(date), 'dd MMMM yyyy', { locale: ru });
  const formattedTime = format(new Date(date), 'HH:mm', { locale: ru });

  // Определяем изображение (по умолчанию или из БД)
  const imageSrc = imageUrl || '/images/HeaderPicture.jpg';

  return (
    <Center
      p={4}
      borderRadius="lg"
      boxShadow="base"
      border="1px solid"
      borderColor="gray.200"
      _hover={{
        boxShadow: '2xl',
        borderColor: 'blue.300',
        transform: 'translateY(-4px)',
        transition: 'all 0.3s ease-in-out',
      }}
      transition="all 0.3s ease"
      h="100%"
      position="relative"
    >
      <Stack w="100%" h="100%">
        {/* Категория */}
        {category && (
          <Badge
            colorScheme={getCategoryColorScheme(category)}
            alignSelf="flex-start"
            borderRadius="full"
            px={3}
            py={1}
            textTransform="capitalize"
            fontSize="sm"
            bgColor={getCategoryColorScheme(category)}
            color="blackAlpha.800"
          >
            {getCategoryLabel(category)}
          </Badge>
        )}

        {/* Заголовок */}
        <Text fontSize="xl" fontWeight="bold" lineHeight="tight" minH="56px">
          {title}
        </Text>

        {/* Дата и время */}
        <Box>
          <Text
            fontSize="sm"
            color="gray.600"
            display="flex"
            alignItems="center"
          >
            📅 {formattedDate}
          </Text>
          <Text
            fontSize="sm"
            color="gray.600"
            display="flex"
            alignItems="center"
          >
            🕒 {formattedTime}
          </Text>
        </Box>

        {/* Изображение */}
        <Center>
          <Image
            src={imageSrc}
            alt={alt}
            w="100%"
            h="180px"
            objectFit="cover"
            borderRadius="md"
            loading="lazy"
          />
        </Center>

        {/* Локация */}
        {location && (
          <Text
            fontSize="sm"
            color="gray.600"
            display="flex"
            alignItems="center"
          >
            📍 {location}
          </Text>
        )}

        {/* Краткое описание */}
        {briefdescription && (
          <Text fontSize="sm" color="gray.700" textAlign="justify" flex="1">
            {briefdescription}
          </Text>
        )}

        {/* Цена */}
        {price !== undefined && (
          <Text fontSize="lg" color="green.600" fontWeight="bold">
            {price === 0 ? 'Бесплатно' : `${price} ₽`}
          </Text>
        )}

        {/* Ссылка */}
        <Link
          href={linkUrl}
          fontSize="md"
          color="blue.500"
          fontWeight="semibold"
          textDecoration="none"
          _hover={{
            color: 'blue.600',
            textDecoration: 'underline',
          }}
          alignSelf="flex-start"
          mt="auto"
          pt={2}
        >
          {linkText} →
        </Link>
      </Stack>
    </Center>
  );
};

export default PosterCard;
