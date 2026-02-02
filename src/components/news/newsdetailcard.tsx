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
  Link,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  FaCalendarAlt,
  FaEye,
  FaBookmark,
  FaEdit,
  FaShareAlt,
  FaPrint,
  FaFacebook,
  FaTwitter,
  FaTelegram,
  FaVk,
  FaCopy,
} from 'react-icons/fa';
import { useState } from 'react';
import { toaster } from '@/components/ui/toaster';

// Типы для пропсов
interface NewsDetailCardProps {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  onBookmark?: () => void;
  onEdit?: () => void;
  category?: string;
  tags?: string[];
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
  onBookmark,
  onEdit,
  category = 'новости',
  tags = [],
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Форматирование дат
  const formattedDate = format(new Date(createdAt), 'dd MMMM yyyy', {
    locale: ru,
  });
  const formattedTime = format(new Date(createdAt), 'HH:mm', { locale: ru });
  const formattedUpdated = format(new Date(updatedAt), 'dd.MM.yyyy HH:mm', {
    locale: ru,
  });

  // Изображение по умолчанию
  const imageSrc = imageUrl || '/images/HeaderPicture.jpg';

  // Обработчики действий
  const handleBookmark = () => {
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    if (onBookmark) {
      onBookmark();
    }

    toaster.create({
      title: newBookmarkedState
        ? 'Добавлено в избранное'
        : 'Удалено из избранного',
      type: 'success',
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${title} - ${excerpt || content.substring(0, 100)}...`;
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(excerpt || '')}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    };

    if (platform in shareUrls) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toaster.create({
        title: 'Ссылка скопирована',
        type: 'success',
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось скопировать ссылку',
        type: 'error',
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Время чтения (примерный расчет)
  const readingTime = Math.max(1, Math.ceil(content.length / 1200));

  return (
    <Box>
      <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={8}>
        {/* Левая колонка - основная информация */}
        <GridItem>
          <Stack>
            {/* Заголовок и мета-информация */}
            <Box>
              <Badge
                colorPalette="blue"
                fontSize="md"
                px={4}
                py={2}
                borderRadius="full"
                mb={4}
              >
                {category}
              </Badge>

              <Heading
                as="h1"
                size="2xl"
                fontWeight="bold"
                color="fg.emphasized"
                mb={4}
              >
                {title}
              </Heading>

              <Flex
                alignItems="center"
                flexWrap="wrap"
                gap={4}
                color="fg.muted"
              >
                <Flex alignItems="center" gap={2}>
                  <Icon as={FaCalendarAlt} boxSize="14px" />
                  <Text fontSize="md">
                    {formattedDate} в {formattedTime}
                  </Text>
                </Flex>

                <Flex alignItems="center" gap={2}>
                  <Icon as={FaEye} boxSize="14px" />
                  <Text fontSize="md">{views} просмотров</Text>
                </Flex>

                <Text fontSize="md">🕑 {readingTime} мин. чтения</Text>

                {updatedAt.getTime() !== createdAt.getTime() && (
                  <Text fontSize="sm" color="fg.subtle" fontStyle="italic">
                    Обновлено: {formattedUpdated}
                  </Text>
                )}
              </Flex>
            </Box>

            {/* Краткое описание */}
            {excerpt && (
              <Box
                bg="bg.subtle"
                p={6}
                borderRadius="lg"
                borderLeft="4px solid"
                borderColor="border.emphasized"
              >
                <Text
                  fontSize="lg"
                  fontWeight="medium"
                  color="fg.emphasized"
                  fontStyle="italic"
                >
                  {excerpt}
                </Text>
              </Box>
            )}

            {/* Основное изображение */}
            {imageUrl && (
              <Box
                borderRadius="xl"
                overflow="hidden"
                boxShadow="lg"
                position="relative"
                mb={4}
              >
                <Image
                  src={imageSrc}
                  alt={title}
                  w="100%"
                  h={{ base: '300px', md: '500px' }}
                  objectFit="cover"
                  loading="eager"
                />
                {imageUrl.includes('unsplash') && (
                  <Box
                    position="absolute"
                    bottom={4}
                    right={4}
                    bg="blackAlpha.700"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                  >
                    Источник: Unsplash
                  </Box>
                )}
              </Box>
            )}

            {/* Содержание - ПРОСТОЙ ВАРИАНТ */}
            <Box
              bg="bg.surface"
              p={{ base: 6, md: 8 }}
              borderRadius="lg"
              boxShadow="sm"
            >
              {/* Вариант 1: Просто div с базовыми стилями */}
              <div
                style={{
                  fontSize: '18px',
                  lineHeight: '1.8',
                  color: '#374151',
                  whiteSpace: 'pre-line',
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Box>

            {/* Теги */}
            {tags.length > 0 && (
              <Box>
                <Heading as="h3" size="md" mb={4} color="fg.emphasized">
                  Теги
                </Heading>
                <Flex flexWrap="wrap" gap={2}>
                  {tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/news?tag=${tag}`}
                      _hover={{ textDecoration: 'none' }}
                    >
                      <Badge
                        colorPalette="gray"
                        px={4}
                        py={2}
                        borderRadius="full"
                        fontSize="sm"
                        _hover={{
                          bg: 'bg.subtle',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s',
                        }}
                      >
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </Flex>
              </Box>
            )}
          </Stack>
        </GridItem>

        {/* Правая колонка - боковая панель */}
        <GridItem>
          <Box
            position="sticky"
            top="100px"
            bg="bg.surface"
            borderRadius="xl"
            boxShadow="lg"
            p={6}
            border="1px solid"
            borderColor="border.subtle"
          >
            <Stack>
              {/* Действия */}
              <Box>
                <Heading as="h3" size="md" mb={4} color="fg.emphasized">
                  Действия
                </Heading>
                <Stack>
                  <Button
                    variant={isBookmarked ? 'solid' : 'outline'}
                    colorPalette={isBookmarked ? 'yellow' : 'gray'}
                    onClick={handleBookmark}
                    w="100%"
                    justifyContent="flex-start"
                    gap={2}
                  >
                    <Icon as={FaBookmark} />
                    {isBookmarked ? 'В избранном' : 'В избранное'}
                  </Button>

                  <Button
                    variant="outline"
                    colorPalette="blue"
                    onClick={() => handleShare('vk')}
                    w="100%"
                    justifyContent="flex-start"
                    gap={2}
                  >
                    <Icon as={FaShareAlt} />
                    Поделиться
                  </Button>

                  {onEdit && (
                    <Button
                      variant="outline"
                      colorPalette="green"
                      onClick={onEdit}
                      w="100%"
                      justifyContent="flex-start"
                      gap={2}
                    >
                      <Icon as={FaEdit} />
                      Редактировать
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    colorPalette="gray"
                    onClick={handlePrint}
                    w="100%"
                    justifyContent="flex-start"
                    gap={2}
                  >
                    <Icon as={FaPrint} />
                    Распечатать
                  </Button>
                </Stack>
              </Box>
              {/* Быстрые ссылки для шаринга */}
              <Box>
                <Heading as="h3" size="sm" mb={3} color="fg.emphasized">
                  Поделиться в соцсетях
                </Heading>
                <Flex gap={3} justifyContent="center">
                  <Button
                    aria-label="Поделиться в Facebook"
                    onClick={() => handleShare('facebook')}
                    variant="ghost"
                    colorPalette="blue"
                    size="sm"
                    p={2}
                  >
                    <Icon as={FaFacebook} boxSize="20px" />
                  </Button>
                  <Button
                    aria-label="Поделиться в Twitter"
                    onClick={() => handleShare('twitter')}
                    variant="ghost"
                    colorPalette="twitter"
                    size="sm"
                    p={2}
                  >
                    <Icon as={FaTwitter} boxSize="20px" />
                  </Button>
                  <Button
                    aria-label="Поделиться ВКонтакте"
                    onClick={() => handleShare('vk')}
                    variant="ghost"
                    colorPalette="blue"
                    size="sm"
                    p={2}
                  >
                    <Icon as={FaVk} boxSize="20px" />
                  </Button>
                  <Button
                    aria-label="Поделиться в Telegram"
                    onClick={() => handleShare('telegram')}
                    variant="ghost"
                    colorPalette="telegram"
                    size="sm"
                    p={2}
                  >
                    <Icon as={FaTelegram} boxSize="20px" />
                  </Button>
                </Flex>
              </Box>

              {/* Копирование ссылки */}
              <Box>
                <Heading as="h3" size="sm" mb={3} color="fg.emphasized">
                  Ссылка на новость
                </Heading>
                <Flex gap={2}>
                  <Box
                    flex="1"
                    p={3}
                    bg="bg.subtle"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="border.subtle"
                    fontSize="sm"
                    color="fg.muted"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {typeof window !== 'undefined' ? window.location.href : ''}
                  </Box>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    colorPalette={copied ? 'green' : 'gray'}
                    size="sm"
                    px={3}
                  >
                    <Icon as={FaCopy} />
                  </Button>
                </Flex>
              </Box>

              {/* Статистика */}
              <Box>
                <Heading as="h3" size="sm" mb={3} color="fg.emphasized">
                  Статистика
                </Heading>
                <Stack>
                  <Flex justifyContent="space-between">
                    <Text color="fg.muted">Просмотры:</Text>
                    <Text fontWeight="semibold">{views}</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text color="fg.muted">Дата публикации:</Text>
                    <Text fontWeight="medium">{formattedDate}</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text color="fg.muted">Время чтения:</Text>
                    <Text fontWeight="medium">{readingTime} мин.</Text>
                  </Flex>
                </Stack>
              </Box>

              {/* Похожие новости (заглушка) */}
              <Box>
                <Heading as="h3" size="sm" mb={3} color="fg.emphasized">
                  Похожие новости
                </Heading>
                <Text fontSize="sm" color="fg.muted" fontStyle="italic">
                  Функция в разработке...
                </Text>
                <Button
                  mt={3}
                  colorPalette="blue"
                  size="sm"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/news';
                    }
                  }}
                >
                  Все новости →
                </Button>
              </Box>
            </Stack>
          </Box>
        </GridItem>
      </Grid>

      {/* Кнопки навигации внизу */}
      <Flex
        justifyContent="space-between"
        mt={8}
        pt={8}
        borderTop="1px solid"
        borderColor="border.subtle"
      >
        <Button
          variant="outline"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/news';
            }
          }}
          gap={2}
        >
          <Icon as={FaCalendarAlt} />
          Все новости
        </Button>
        <Button variant="outline" onClick={handleCopyLink} gap={2}>
          <Icon as={FaShareAlt} />
          Поделиться новостью
        </Button>
      </Flex>
    </Box>
  );
};

export default NewsDetailCard;
