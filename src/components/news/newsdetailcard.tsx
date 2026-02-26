// components/news/newsdetailcard.tsx
'use client';
import {
  Box,
  Container,
  Image,
  Stack,
  Text,
  Heading,
  Badge,
  Button,
  Grid,
  GridItem,
  Flex,
  Icon,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaShare,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toaster } from '../ui/toaster';

interface NewsDetailCardProps {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  images?: Array<{
    id: string;
    url: string;
    alt?: string | null;
    caption?: string | null;
    order: number;
  }>;
  onBookmark?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const NewsDetailCard: React.FC<NewsDetailCardProps> = ({
  id,
  title,
  content,
  excerpt,
  imageUrl,
  isPublished,
  views,
  createdAt,
  updatedAt,
  images = [],
  onBookmark,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Форматирование дат
  const formattedDate = format(new Date(createdAt), 'dd MMMM yyyy', {
    locale: ru,
  });
  const formattedTime = format(new Date(createdAt), 'HH:mm', { locale: ru });
  const formattedUpdateDate = format(new Date(updatedAt), 'dd MMMM yyyy', {
    locale: ru,
  });

  // Основное изображение (первое из массива или отдельное)
  const mainImage = images.length > 0 ? images[0].url : imageUrl;
  const imageSrc = mainImage || '/images/HeaderPicture.jpg';

  // Галерея изображений (все кроме первого)
  const galleryImages = images.slice(1);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: excerpt || content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toaster.create({
        title: 'Ссылка скопирована',
        type: 'success',
        duration: 2000,
      });
    }
  };

  const handleBookmark = () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    if (onBookmark) onBookmark();

    toaster.create({
      title: newState ? 'Добавлено в избранное' : 'Удалено из избранного',
      type: 'success',
      duration: 2000,
    });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/admin/news/edit/${id}`);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при удалении');
      }

      toaster.create({
        title: 'Новость удалена',
        type: 'success',
        duration: 3000,
      });

      if (onDelete) {
        onDelete();
      } else {
        router.push('/news');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toaster.create({
        title: 'Ошибка',
        description:
          error instanceof Error ? error.message : 'Не удалось удалить новость',
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Box>
      <Container maxW="1200px" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={8}>
          {/* Левая колонка - основная информация */}
          <GridItem>
            <Stack>
              {/* Заголовок и действия */}
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={4}
              >
                <Heading as="h1" size="2xl" fontWeight="bold" color="gray.800">
                  {title}
                </Heading>

                <HStack>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    Поделиться
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBookmark}
                    colorScheme={isBookmarked ? 'yellow' : 'gray'}
                  >
                    {isBookmarked ? 'В избранном' : 'В избранное'}
                  </Button>
                </HStack>
              </Flex>

              {/* Мета-информация */}
              <HStack flexWrap="wrap" gap={2}>
                <HStack>
                  <Icon as={FaCalendarAlt} color="blue.500" />
                  <Text>{formattedDate}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaClock} color="green.500" />
                  <Text>{formattedTime}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaEye} color="gray.500" />
                  <Text>{views} просмотров</Text>
                </HStack>
                {!isPublished && (
                  <Badge colorScheme="yellow" px={3} py={1} borderRadius="full">
                    Черновик
                  </Badge>
                )}
              </HStack>

              {/* Краткое описание (если есть) */}
              {excerpt && (
                <Box
                  bg="blue.50"
                  p={4}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderLeftColor="blue.500"
                >
                  <Text fontSize="lg" fontStyle="italic" color="gray.700">
                    {excerpt}
                  </Text>
                </Box>
              )}

              {/* Основное изображение */}
              <Box borderRadius="xl" overflow="hidden" boxShadow="xl">
                <Image
                  src={imageSrc}
                  alt={title}
                  w="100%"
                  h={{ base: '300px', md: '400px' }}
                  objectFit="cover"
                  loading="eager"
                />
              </Box>

              {/* Галерея изображений */}
              {galleryImages.length > 0 && (
                <Box>
                  <Heading as="h2" size="md" mb={4}>
                    Фотогалерея
                  </Heading>
                  <Grid columns={{ base: 2, md: 3, lg: 4 }} gap={4}>
                    {galleryImages.map(img => (
                      <Box
                        key={img.id}
                        borderRadius="lg"
                        overflow="hidden"
                        cursor="pointer"
                        onClick={() => window.open(img.url, '_blank')}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt || title}
                          w="100%"
                          h="150px"
                          objectFit="cover"
                          _hover={{ transform: 'scale(1.05)' }}
                          transition="transform 0.2s"
                        />
                        {img.caption && (
                          <Text fontSize="xs" mt={1} color="gray.600">
                            {img.caption}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Полный текст новости */}
              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.100"
              >
                <Heading as="h2" size="lg" mb={4} color="gray.800">
                  Содержание
                </Heading>
                <Text
                  fontSize="md"
                  lineHeight="1.8"
                  color="gray.700"
                  whiteSpace="pre-line"
                >
                  {content}
                </Text>
              </Box>

              {/* Информация об обновлении */}
              {createdAt !== updatedAt && (
                <Text fontSize="sm" color="gray.500" textAlign="right">
                  Обновлено: {formattedUpdateDate}
                </Text>
              )}
            </Stack>
          </GridItem>

          {/* Правая колонка - боковая панель */}
          <GridItem>
            <Box
              position="sticky"
              top="100px"
              bg="white"
              borderRadius="xl"
              boxShadow="xl"
              p={6}
              border="1px solid"
              borderColor="gray.200"
            >
              <VStack align="stretch">
                {/* Статистика */}
                <Box textAlign="center">
                  <Heading as="h3" size="xl" color="blue.600">
                    {views}
                  </Heading>
                  <Text color="gray.600">просмотров</Text>
                </Box>

                {/* Действия для всех пользователей */}
                <Button colorScheme="blue" size="lg" onClick={handleShare}>
                  Поделиться
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBookmark}
                  colorScheme={isBookmarked ? 'yellow' : 'gray'}
                >
                  {isBookmarked ? 'В избранном' : 'Добавить в избранное'}
                </Button>

                {/* Действия для администратора */}
                {isAuthenticated && (
                  <>
                    <Text fontWeight="bold" color="gray.700">
                      Управление
                    </Text>

                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="lg"
                      onClick={handleEdit}
                    >
                      Редактировать
                    </Button>

                    <Button
                      colorScheme="red"
                      variant="outline"
                      size="lg"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      Удалить
                    </Button>

                    {!isPublished && (
                      <Badge colorScheme="yellow" p={2} textAlign="center">
                        Черновик (виден только администраторам)
                      </Badge>
                    )}
                  </>
                )}
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>

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
            <Heading size="md" mb={4}>
              Удаление новости
            </Heading>
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
    </Box>
  );
};

export default NewsDetailCard;
