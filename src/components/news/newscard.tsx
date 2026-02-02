import { Box, Image, Text, Link, Stack, Center, Badge } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
}) => {
  // Форматирование даты
  const formattedDate = format(new Date(date), 'dd MMMM yyyy', { locale: ru });
  const formattedTime = format(new Date(date), 'HH:mm', { locale: ru });

  // Определяем изображение
  const imageSrc = imageUrl || '/images/HeaderPicture.jpg';

  // Обрезаем текст для превью
  const previewText = excerpt || content.substring(0, 150) + '...';

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

export default NewsCard;
