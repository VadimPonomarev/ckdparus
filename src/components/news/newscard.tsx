// components/news/newscard.tsx
'use client';
import {
  Box,
  Image,
  Text,
  Link,
  Stack,
  Center,
  Badge,
  HStack,
  Button,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface NewsCardProps {
  id: string;
  title: string;
  date: Date;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  views: number;
  isPublished?: boolean;
  alt?: string;
  linkUrl?: string;
  linkText?: string;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  date,
  content,
  excerpt,
  imageUrl,
  views,
  isPublished = true,
  alt,
  linkUrl = `/news/${id}`,
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

  // Определяем изображение
  const imageSrc = imageUrl || '/images/HeaderPicture.jpg';

  // Обрезаем текст для превью
  const previewText = excerpt || content.substring(0, 150) + '...';

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/admin/news/edit/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/news/${id}`, {
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
      alert('Новость успешно удалена');
    } catch (error) {
      console.error('Error deleting news:', error);
      alert(error instanceof Error ? error.message : 'Ошибка при удалении');
    } finally {
      setIsDeleting(false);
    }
  };

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
        h="100%"
        position="relative"
        opacity={isPublished ? 1 : 0.7}
      >
        <Stack w="100%" h="100%">
          {/* Статус публикации */}
          {!isPublished && (
            <Badge
              colorScheme="yellow"
              alignSelf="flex-start"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
            >
              Черновик
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
              gap={1}
            >
              📅 {formattedDate} в {formattedTime}
            </Text>
            <Text fontSize="xs" color="gray.500">
              👁 {views} просмотров
            </Text>
          </Box>

          {/* Изображение */}
          <Center>
            <Image
              src={imageSrc}
              alt={alt || title}
              w="100%"
              h="180px"
              objectFit="cover"
              borderRadius="md"
              loading="lazy"
            />
          </Center>

          {/* Краткое описание */}
          <Text fontSize="sm" color="gray.700" textAlign="justify" flex="1">
            {previewText}
          </Text>

          {/* Кнопки действий для администратора */}
          {isAuthenticated && (
            <HStack
              gap={2}
              mt={2}
              pt={2}
              borderTop="1px solid"
              borderColor="gray.200"
            >
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
              Удаление новости
            </Text>
            <Text mb={4}>
              Вы уверены, что хотите удалить новость "{title}"?
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

export default NewsCard;
