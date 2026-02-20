import {
  Center,
  Image,
  Link,
  Stack,
  Text,
  Box,
  Badge,
  HStack,
  IconButton,
  Menu,
  Portal,
  Button,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
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
  showActions?: boolean; // Добавлено: показывать ли кнопки действий
  onDelete?: (id: string) => void; // Добавлено: колбэк после удаления
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
    другое: 'cyan.500',
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
  showActions = false, // Добавлено
  onDelete, // Добавлено
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // Добавлено: проверка авторизации
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Форматирование даты
  const formattedDate = format(new Date(date), 'dd MMMM yyyy', { locale: ru });
  const formattedTime = format(new Date(date), 'HH:mm', { locale: ru });

  // Определяем изображение (по умолчанию или из БД)
  const imageSrc = imageUrl || '/images/HeaderPicture.jpg';

  // Добавлено: обработчики для действий
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
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(error instanceof Error ? error.message : 'Ошибка при удалении');
    } finally {
      setIsDeleting(false);
    }
  };

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
        {/* Верхняя строка с категорией и кнопками действий */}
        <HStack justify="space-between" align="center">
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

          {/* Добавлено: кнопки действий для администратора */}
          {showActions && isAuthenticated && (
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton
                  aria-label="Действия"
                  size="sm"
                  variant="ghost"
                  onClick={e => e.stopPropagation()}
                >
                  <FiMoreVertical />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="edit" onClick={handleEdit}>
                      <HStack gap="2">
                        <FiEdit2 />
                        <Text>Редактировать</Text>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="delete"
                      color="red.500"
                      onClick={e => {
                        e.stopPropagation();
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <HStack gap="2">
                        <FiTrash2 />
                        <Text>Удалить</Text>
                      </HStack>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </HStack>

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
            objectFit="contain"
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

      {/* Добавлено: диалог подтверждения удаления */}
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
              >
                Отмена
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                Удалить
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </Center>
  );
};

export default PosterCard;
