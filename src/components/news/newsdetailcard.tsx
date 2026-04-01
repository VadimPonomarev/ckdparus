// components/news/newsdetailcard.tsx
import {
  Box,
  Image,
  Stack,
  Text,
  Heading,
  Badge,
  Button,
  Flex,
  Icon,
  Link,
  useBreakpointValue,
  HStack,
  VStack,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  FaCalendarAlt,
  FaEye,
  FaVk,
  FaTelegram,
  FaImages,
  FaArrowLeft,
  FaShare,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import GallerySlider from '@/components/gallery/galleryslider';
import { useRouter } from 'next/navigation';

// Типы для пропсов
interface NewsImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  order: number;
}

interface NewsDetailCardProps {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  images?: NewsImage[];
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  tags?: string[];
}

const NewsDetailCard: React.FC<NewsDetailCardProps> = ({
  id,
  title,
  content,
  excerpt,
  imageUrl,
  images = [],
  views,
  createdAt,
  updatedAt,
  category = 'новости',
  tags = [],
}) => {
  const router = useRouter();
  const [showGallery, setShowGallery] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Форматирование дат
  const formattedDate = format(new Date(createdAt), 'dd MMMM yyyy', {
    locale: ru,
  });
  const formattedTime = format(new Date(createdAt), 'HH:mm', { locale: ru });

  // Изображение по умолчанию
  const imageSrc = imageUrl || '/images/HeaderPicture.jpg';

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${title} - ${excerpt || content.substring(0, 100)}...`;

    if (platform === 'native' && navigator.share) {
      navigator
        .share({
          title: title,
          text: excerpt || content.substring(0, 100),
          url: url,
        })
        .catch(() => {
          setShowShareMenu(true);
        });
    } else {
      const shareUrls: Record<string, string> = {
        vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(excerpt || '')}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      };

      if (platform in shareUrls) {
        window.open(shareUrls[platform], '_blank');
      }
    }
    setShowShareMenu(false);
  };

  const handleOpenGallery = () => {
    setShowGallery(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
    document.body.style.overflow = 'unset';
  };

  // Время чтения
  const readingTime = Math.max(1, Math.ceil(content.length / 1200));

  // Определяем, мобильное ли устройство
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {/* Галерея */}
      {showGallery && images.length > 0 && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="black"
          zIndex={9999}
        >
          <Button
            position="absolute"
            top={isMobile ? 2 : 4}
            right={isMobile ? 2 : 4}
            zIndex={10000}
            colorScheme="whiteAlpha"
            onClick={handleCloseGallery}
            size={isMobile ? 'sm' : 'md'}
            borderRadius="full"
          >
            ✕
          </Button>
          <GallerySlider
            images={images.map(img => ({
              id: img.id,
              url: img.url,
              alt: img.alt || `Фото к новости "${title}"`,
              caption: img.caption,
            }))}
          />
        </Box>
      )}

      {/* Мобильное меню шаринга */}
      {showShareMenu && isMobile && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={1000}
          onClick={() => setShowShareMenu(false)}
        >
          <VStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            bg="white"
            p={4}
            borderTopRadius="xl"
            onClick={e => e.stopPropagation()}
          >
            <Text fontWeight="bold">Поделиться через</Text>
            <HStack justify="center">
              <Button
                variant="ghost"
                colorScheme="blue"
                onClick={() => handleShare('vk')}
                flexDirection="column"
                h="auto"
                py={2}
              >
                <Icon as={FaVk} boxSize="30px" mb={1} />
                <Text fontSize="xs">VK</Text>
              </Button>
              <Button
                variant="ghost"
                colorScheme="blue"
                onClick={() => handleShare('telegram')}
                flexDirection="column"
                h="auto"
                py={2}
              >
                <Icon as={FaTelegram} boxSize="30px" mb={1} />
                <Text fontSize="xs">Telegram</Text>
              </Button>
            </HStack>
            <Button size="sm" onClick={() => setShowShareMenu(false)}>
              Отмена
            </Button>
          </VStack>
        </Box>
      )}

      {/* Основной контент */}
      <Box w="100%" px={{ base: 2, sm: 4, md: 6 }}>
        {/* Кнопка назад */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          size="sm"
          mb={4}
          p={5}
          _hover={{ bg: 'gray.500' }}
        >
          Назад
        </Button>

        {/* Используем Grid для десктопной версии */}
        <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={6}>
          {/* Левая колонка - основной контент */}
          <GridItem>
            {/* Заголовок */}
            <Heading
              as="h1"
              size={{ base: 'lg', md: '2xl' }}
              fontWeight="bold"
              mb={3}
              lineHeight="1.3"
            >
              {title}
            </Heading>

            {/* Мета-информация */}
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              wrap="wrap"
              gap={2}
              mb={4}
              fontSize="sm"
              color="gray.600"
            >
              <Flex align="center" gap={1}>
                <Icon as={FaCalendarAlt} boxSize="12px" />
                <Text>
                  {formattedDate} в {formattedTime}
                </Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Icon as={FaEye} boxSize="12px" />
                <Text>{views} просмотров</Text>
              </Flex>
              <Text>🕑 {readingTime} мин. чтения</Text>
            </Flex>

            {/* Краткое описание */}
            {excerpt && (
              <Box
                bg="gray.50"
                p={4}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="blue.400"
                mb={4}
              >
                <Text fontSize={{ base: 'sm', md: 'md' }} fontStyle="italic">
                  {excerpt}
                </Text>
              </Box>
            )}

            {/* Основное изображение */}
            {imageUrl && (
              <Box
                borderRadius="lg"
                overflow="hidden"
                mb={4}
                position="relative"
                onClick={images.length > 0 ? handleOpenGallery : undefined}
                cursor={images.length > 0 ? 'pointer' : 'default'}
              >
                <Image
                  src={imageSrc}
                  alt={title}
                  w="100%"
                  h={{ base: '200px', sm: '300px', md: '400px' }}
                  objectFit="cover"
                />
                {images.length > 0 && (
                  <HStack
                    position="absolute"
                    bottom={2}
                    right={2}
                    bg="blackAlpha.700"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                  >
                    <Icon as={FaImages} />
                    <Text>{images.length}</Text>
                  </HStack>
                )}
              </Box>
            )}

            {/* Миниатюры */}
            {images.length > 1 && (
              <Flex gap={2} mb={4} overflowX="auto" pb={2}>
                {images.slice(0, 5).map((img, idx) => (
                  <Box
                    key={img.id}
                    flexShrink={0}
                    w="60px"
                    h="60px"
                    borderRadius="md"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={handleOpenGallery}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || ''}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                ))}
                {images.length > 5 && (
                  <Box
                    flexShrink={0}
                    w="60px"
                    h="60px"
                    borderRadius="md"
                    bg="blackAlpha.700"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="sm"
                    cursor="pointer"
                    onClick={handleOpenGallery}
                  >
                    +{images.length - 5}
                  </Box>
                )}
              </Flex>
            )}

            {/* Контент */}
            <Box
              bg="white"
              p={{ base: 4, md: 6 }}
              borderRadius="lg"
              boxShadow="sm"
              mb={4}
            >
              <div
                style={{
                  fontSize: isMobile ? '16px' : '18px',
                  lineHeight: '1.7',
                  color: '#2D3748',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Box>

            {/* Теги */}
            {tags.length > 0 && (
              <Box mb={4}>
                <Text fontWeight="bold" mb={2} fontSize="sm">
                  Теги:
                </Text>
                <Flex wrap="wrap" gap={2}>
                  {tags.map((tag, idx) => (
                    <Link
                      key={idx}
                      href={`/news?tag=${tag}`}
                      _hover={{ textDecoration: 'none' }}
                    >
                      <Badge
                        colorPalette="gray"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                      >
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </Flex>
              </Box>
            )}
          </GridItem>

          {/* Правая колонка - боковая панель для десктопа */}
          <GridItem display={{ base: 'none', md: 'block' }}>
            <Box
              position="sticky"
              top="20px"
              bg="white"
              p={4}
              borderRadius="lg"
              boxShadow="md"
            >
              <VStack align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Действия
                  </Text>
                  {images.length > 0 && (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={handleOpenGallery}
                      w="100%"
                      mb={2}
                    >
                      Открыть галерею ({images.length})
                    </Button>
                  )}
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => {
                      router.push('/allnews');
                    }}
                    w="100%"
                  >
                    Все новости
                  </Button>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Поделиться
                  </Text>
                  <HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare('vk')}
                      flex={1}
                    >
                      <FaVk />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare('telegram')}
                      flex={1}
                    >
                      <FaTelegram />
                    </Button>
                  </HStack>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Статистика
                  </Text>
                  <Flex justify="space-between" fontSize="sm">
                    <Text color="gray.600">Просмотры:</Text>
                    <Text fontWeight="medium">{views}</Text>
                  </Flex>
                  <Flex justify="space-between" fontSize="sm">
                    <Text color="gray.600">Дата:</Text>
                    <Text fontWeight="medium">{formattedDate}</Text>
                  </Flex>
                  <Flex justify="space-between" fontSize="sm">
                    <Text color="gray.600">Чтение:</Text>
                    <Text fontWeight="medium">{readingTime} мин.</Text>
                  </Flex>
                </Box>
              </VStack>
            </Box>
          </GridItem>
        </Grid>

        {/* Нижняя панель для мобильных */}
        {isMobile && (
          <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
            p={3}
            zIndex={10}
          >
            <HStack>
              {images.length > 0 && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={handleOpenGallery}
                  flex={1}
                >
                  Фото ({images.length})
                </Button>
              )}
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => {
                  router.push('/allnews');
                }}
                flex={1}
              >
                Все новости
              </Button>
            </HStack>
          </Box>
        )}

        {/* Отступ для мобильной версии, чтобы контент не перекрывался нижней панелью */}
        {isMobile && <Box height="70px" />}
      </Box>
    </>
  );
};

export default NewsDetailCard;
