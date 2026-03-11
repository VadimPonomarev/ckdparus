import {
  Center,
  Image,
  Link,
  Stack,
  Text,
  Box,
  Badge,
  HStack,
  Button,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

// Функция для получения цветовой схемы по категории
const getCategoryColor = (category: string): string => {
  const categoryMap: Record<string, string> = {
    концерт: 'teal.500',
    выставка: 'green.500',
    спектакль: 'red.500',
    фестиваль: 'orange.500',
    'мастер-класс': 'blue.500',
    лекция: 'purple.500',
    конкурс: 'pink.500',
    другое: 'cyan.500',
  };

  return categoryMap[category.toLowerCase()] || 'gray.500';
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
  onDelete,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Форматирование даты
  const formattedDate = format(new Date(date), 'dd MMMM yyyy', { locale: ru });
  const formattedTime = format(new Date(date), 'HH:mm', { locale: ru });

  // Определяем изображение (по умолчанию или из БД)
  const imageSrc = imageUrl || '/images/HeaderPicture.jpg';

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/admin/events/edit/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при удалении');
      }

      if (onDelete) {
        onDelete(id);
      }

      setIsDeleteDialogOpen(false);
      alert('Событие успешно удалено');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(error instanceof Error ? error.message : 'Ошибка при удалении');
    } finally {
      setIsDeleting(false);
    }
  };

  // Сокращаем название локации для отображения
  const displayLocation =
    location === 'Калининградская область, г. Советск, ул. Победы 34 а'
      ? 'ЦКД Парус'
      : location;

  return (
    <>
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
        h="500px" // Фиксированная высота
        position="relative"
      >
        <Stack w="100%" h="100%" overflow="hidden">
          {/* Категория */}
          {category && (
            <Badge
              bgColor={getCategoryColor(category)}
              alignSelf="flex-start"
              borderRadius="full"
              px={3}
              py={1}
              textTransform="capitalize"
              fontSize="sm"
              color="white"
              css={{
                display: '-webkit-box',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxWidth: '100%',
              }}
            >
              {getCategoryLabel(category)}
            </Badge>
          )}

          {/* Заголовок с ограничением в 2 строки */}
          <Text
            fontSize="xl"
            fontWeight="bold"
            lineHeight="tight"
            css={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '56px',
            }}
          >
            {title}
          </Text>

          {/* Дата и время */}
          <Box>
            <Text
              fontSize="sm"
              color="gray.600"
              display="flex"
              alignItems="center"
              css={{
                display: '-webkit-box',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              📅 {formattedDate}
            </Text>
            <Text
              fontSize="sm"
              color="gray.600"
              display="flex"
              alignItems="center"
              css={{
                display: '-webkit-box',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              🕒 {formattedTime}
            </Text>
          </Box>

          {/* Изображение фиксированной высоты */}
          <Center>
            <Image
              src={imageSrc}
              alt={alt}
              w="100%"
              h="160px" // Фиксированная высота изображения
              objectFit="cover" // Изменено с contain на cover для единообразия
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
              css={{
                display: '-webkit-box',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              📍 {displayLocation}
            </Text>
          )}

          {/* Краткое описание с ограничением в 3 строки */}
          {briefdescription && (
            <Text
              fontSize="sm"
              color="gray.700"
              textAlign="justify"
              css={{
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: '1',
              }}
            >
              {briefdescription}
            </Text>
          )}

          {/* Цена */}
          {price !== undefined && (
            <Text
              fontSize="lg"
              color="green.600"
              fontWeight="bold"
              css={{
                display: '-webkit-box',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {price === 0 ? 'Бесплатно' : `${price} ₽`}
            </Text>
          )}

          {/* Кнопки действий для администратора */}
          {isAuthenticated && (
            <HStack gap={2} pt={2} borderTop="1px solid" borderColor="gray.200">
              <Button
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={handleEdit}
                flex={1}
              >
                Редактировать
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(true)}
                flex={1}
              >
                Удалить
              </Button>
            </HStack>
          )}

          {/* Ссылка "Подробнее" */}
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
            pt={1}
          >
            {linkText} →
          </Link>
        </Stack>
      </Center>

      {/* Диалог подтверждения удаления */}
      {isDeleteDialogOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          zIndex="modal"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => setIsDeleteDialogOpen(false)}
        >
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            maxW="400px"
            onClick={e => e.stopPropagation()}
          >
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Удаление события
            </Text>
            <Text mb={4}>
              Вы уверены, что хотите удалить событие "{title}"?
            </Text>
            <Text fontSize="sm" color="gray.500" mb={6}>
              Это действие нельзя отменить.
            </Text>
            <HStack justify="flex-end" gap={3}>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Отмена
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                loading={isDeleting}
                loadingText="Удаление..."
              >
                Удалить
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default PosterCard;
