// components/news/newsdetailcard.tsx
import {
  Box,
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
  useBreakpointValue,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  FaCalendarAlt,
  FaEye,
  FaVk,
  FaTelegram,
  FaImages,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { toaster } from '@/components/ui/toaster';
import GallerySlider from '@/components/gallery/galleryslider';

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
  const [showGallery, setShowGallery] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${title} - ${excerpt || content.substring(0, 100)}...`;
    const shareUrls = {
      vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(excerpt || '')}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    };

    if (platform in shareUrls) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  const handleOpenGallery = () => {
    if (images.length > 0) {
      setShowGallery(true);
      // Блокируем скролл body при открытии галереи на мобильных
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    }
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
    // Возвращаем скролл
    document.body.style.overflow = 'unset';
  };

  // Время чтения (примерный расчет)
  const readingTime = Math.max(1, Math.ceil(content.length / 1200));

  // Преобразуем изображения для галереи
  const galleryImages = images.map(img => ({
    id: img.id,
    url: img.url,
    alt: img.alt || `Фото к новости "${title}"`,
    caption: img.caption,
  }));

  // Адаптивные значения
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' }) as
    | 'xl'
    | '2xl';
  const contentFontSize = useBreakpointValue({ base: '16px', md: '18px' });
  const imageHeight = useBreakpointValue({
    base: '250px',
    sm: '300px',
    md: '500px',
  });
  const sidebarPosition = useBreakpointValue({
    base: 'static',
    lg: 'sticky',
  }) as 'static' | 'sticky';
  const sidebarTop = useBreakpointValue({ base: '0', lg: '100px' });

  return (
    <Box>
      {/* Модальное окно галереи */}
      {showGallery && galleryImages.length > 0 && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="black"
          zIndex={9999}
          overflow="hidden"
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
            p={isMobile ? 2 : 4}
            minW="auto"
            h="auto"
          >
            ✕
          </Button>
          <GallerySlider images={galleryImages} />
        </Box>
      )}

      <Grid
        templateColumns={{ base: '1fr', lg: '3fr 1fr' }}
        gap={{ base: 4, md: 6, lg: 8 }}
        px={{ base: 2, sm: 4, md: 6 }}
      >
        {/* Левая колонка - основная информация */}
        <GridItem>
          <Stack gap={{ base: 4, md: 6 }}>
            {/* Заголовок и мета-информация */}
            <Box>
              <Badge
                colorPalette="blue"
                fontSize={{ base: 'sm', md: 'md' }}
                px={{ base: 3, md: 4 }}
                py={{ base: 1, md: 2 }}
                borderRadius="full"
                mb={{ base: 2, md: 4 }}
              >
                {category}
              </Badge>

              <Heading
                as="h1"
                size={headingSize}
                fontWeight="bold"
                color="fg.emphasized"
                mb={{ base: 2, md: 4 }}
                lineHeight="1.3"
              >
                {title}
              </Heading>

              <Flex
                alignItems="flex-start"
                flexDirection={{ base: 'column', sm: 'row' }}
                flexWrap="wrap"
                gap={{ base: 2, md: 4 }}
                color="fg.muted"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                <Flex alignItems="center" gap={2}>
                  <Icon
                    as={FaCalendarAlt}
                    boxSize={{ base: '12px', md: '14px' }}
                  />
                  <Text>
                    {formattedDate} в {formattedTime}
                  </Text>
                </Flex>

                <Flex alignItems="center" gap={2}>
                  <Icon as={FaEye} boxSize={{ base: '12px', md: '14px' }} />
                  <Text>{views} просмотров</Text>
                </Flex>

                {images.length > 0 && (
                  <Flex alignItems="center" gap={2}>
                    <Icon
                      as={FaImages}
                      boxSize={{ base: '12px', md: '14px' }}
                    />
                    <Text>{images.length} фото</Text>
                  </Flex>
                )}

                <Flex alignItems="center" gap={2}>
                  <Text>🕑 {readingTime} мин. чтения</Text>
                </Flex>

                {updatedAt.getTime() !== createdAt.getTime() && (
                  <Text fontSize="xs" color="fg.subtle" fontStyle="italic">
                    Обновлено: {formattedUpdated}
                  </Text>
                )}
              </Flex>
            </Box>

            {/* Краткое описание */}
            {excerpt && (
              <Box
                bg="bg.subtle"
                p={{ base: 4, md: 6 }}
                borderRadius="lg"
                borderLeft="4px solid"
                borderColor="border.emphasized"
              >
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
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
                mb={{ base: 2, md: 4 }}
                cursor={images.length > 0 ? 'pointer' : 'default'}
                onClick={handleOpenGallery}
              >
                <Image
                  src={imageSrc}
                  alt={title}
                  w="100%"
                  h={imageHeight}
                  objectFit="cover"
                  loading="eager"
                />
                {images.length > 0 && (
                  <Box
                    position="absolute"
                    bottom={{ base: 2, md: 4 }}
                    right={{ base: 2, md: 4 }}
                    bg="blackAlpha.700"
                    color="white"
                    px={{ base: 2, md: 3 }}
                    py={{ base: 1, md: 1 }}
                    borderRadius="md"
                    fontSize={{ base: 'xs', md: 'sm' }}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon as={FaImages} />
                    {images.length} фото
                  </Box>
                )}
              </Box>
            )}

            {/* Миниатюры дополнительных изображений */}
            {images.length > 1 && (
              <Flex
                gap={2}
                mb={{ base: 4, md: 6 }}
                overflowX="auto"
                py={2}
                css={{
                  '::-webkit-scrollbar': {
                    height: '4px',
                  },
                  '::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                  },
                  '::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '2px',
                  },
                }}
              >
                {images.slice(0, 5).map((img, index) => (
                  <Box
                    key={img.id}
                    flexShrink={0}
                    w={{ base: '70px', md: '100px' }}
                    h={{ base: '60px', md: '80px' }}
                    borderRadius="md"
                    overflow="hidden"
                    cursor="pointer"
                    border="2px solid"
                    borderColor={
                      img.url === imageUrl ? 'blue.500' : 'transparent'
                    }
                    onClick={handleOpenGallery}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `Фото ${index + 1}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                ))}
                {images.length > 5 && (
                  <Box
                    flexShrink={0}
                    w={{ base: '70px', md: '100px' }}
                    h={{ base: '60px', md: '80px' }}
                    borderRadius="md"
                    bg="blackAlpha.700"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    onClick={handleOpenGallery}
                    fontSize={{ base: 'sm', md: 'md' }}
                  >
                    +{images.length - 5}
                  </Box>
                )}
              </Flex>
            )}

            {/* Содержание */}
            <Box
              bg="bg.surface"
              p={{ base: 4, md: 8 }}
              borderRadius="lg"
              boxShadow="sm"
            >
              <div
                style={{
                  fontSize: contentFontSize,
                  lineHeight: '1.8',
                  color: '#374151',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Box>

            {/* Теги */}
            {tags.length > 0 && (
              <Box>
                <Heading
                  as="h3"
                  size={{ base: 'sm', md: 'md' }}
                  mb={{ base: 2, md: 4 }}
                  color="fg.emphasized"
                >
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
                        px={{ base: 3, md: 4 }}
                        py={{ base: 1, md: 2 }}
                        borderRadius="full"
                        fontSize={{ base: 'xs', md: 'sm' }}
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
            position={sidebarPosition}
            top={sidebarTop}
            bg="bg.surface"
            borderRadius="xl"
            boxShadow={{ base: 'none', lg: 'lg' }}
            p={{ base: 4, md: 6 }}
            border={{ base: 'none', lg: '1px solid' }}
            borderColor={{ lg: 'border.subtle' }}
            // На мобильных делаем нижнюю панель
            {...(isMobile && {
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              bg: 'bg.surface',
              boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
              borderRadius: 'xl xl 0 0',
              maxH: 'auto',
              overflowY: 'auto',
            })}
          >
            <Stack gap={{ base: 3, md: 4 }}>
              {/* Действия */}
              <Box>
                <Heading
                  as="h3"
                  size={{ base: 'sm', md: 'md' }}
                  mb={{ base: 2, md: 4 }}
                  color="fg.emphasized"
                >
                  Действия
                </Heading>
                <Stack>
                  {images.length > 0 && (
                    <Button
                      variant="outline"
                      colorPalette="blue"
                      onClick={handleOpenGallery}
                      w="100%"
                      justifyContent={{ base: 'center', md: 'flex-start' }}
                      gap={2}
                      size={{ base: 'sm', md: 'md' }}
                    >
                      <Icon as={FaImages} />
                      <Text display={{ base: 'inline', sm: 'inline' }}>
                        {isMobile
                          ? 'Галерея'
                          : `Открыть галерею (${images.length})`}
                      </Text>
                    </Button>
                  )}
                </Stack>
              </Box>

              {/* Быстрые ссылки для шаринга */}
              <Box>
                <Heading
                  as="h3"
                  size="sm"
                  mb={{ base: 2, md: 3 }}
                  color="fg.emphasized"
                >
                  Поделиться
                </Heading>
                <Flex
                  gap={3}
                  justifyContent={{ base: 'space-around', md: 'center' }}
                >
                  <Button
                    aria-label="Поделиться ВКонтакте"
                    onClick={() => handleShare('vk')}
                    variant="ghost"
                    colorPalette="blue"
                    size={{ base: 'md', md: 'sm' }}
                    p={2}
                    flex={{ base: 1, md: 'none' }}
                  >
                    <Icon as={FaVk} boxSize={{ base: '24px', md: '20px' }} />
                  </Button>
                  <Button
                    aria-label="Поделиться в Telegram"
                    onClick={() => handleShare('telegram')}
                    variant="ghost"
                    colorPalette="telegram"
                    size={{ base: 'md', md: 'sm' }}
                    p={2}
                    flex={{ base: 1, md: 'none' }}
                  >
                    <Icon
                      as={FaTelegram}
                      boxSize={{ base: '24px', md: '20px' }}
                    />
                  </Button>
                </Flex>
              </Box>

              {/* Статистика */}
              <Box display={{ base: 'none', md: 'block' }}>
                <Heading as="h3" size="sm" mb={3} color="fg.emphasized">
                  Статистика
                </Heading>
                <Stack gap={2}>
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
                  {images.length > 0 && (
                    <Flex justifyContent="space-between">
                      <Text color="fg.muted">Фотографий:</Text>
                      <Text fontWeight="medium">{images.length}</Text>
                    </Flex>
                  )}
                </Stack>
              </Box>

              {/* Все новости */}
              <Box>
                <Button
                  mt={{ base: 0, md: 2 }}
                  colorPalette="blue"
                  size={{ base: 'lg', md: 'sm' }}
                  w="100%"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/allnews';
                    }
                  }}
                  py={{ base: 6, md: 2 }}
                >
                  Все новости →
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Отступ для мобильной версии, чтобы контент не перекрывался нижней панелью */}
          {isMobile && <Box height="120px" />}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default NewsDetailCard;
