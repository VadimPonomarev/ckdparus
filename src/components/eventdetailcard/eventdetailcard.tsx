// components/EventDetailCard.tsx
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
  Dialog,
  Portal,
  CloseButton,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaInstagram,
  FaVk,
  FaTelegram,
  FaExpand,
} from 'react-icons/fa';
import { useState } from 'react';
import { toaster } from '@/components/ui/toaster';

// Типы для пропсов
interface EventDetailCardProps {
  id: string;
  title: string;
  date: Date;
  imageUrl?: string;
  alt?: string;
  description: string;
  location: string;
  address?: string;
  price?: number;
  category?: string;
  organizer?: string;
  organizerContacts?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  fulldescription?: string;
  tags?: string[];
  socialLinks?: {
    instagram?: string;
    vk?: string;
    telegram?: string;
  };
  payUrl?: string;
  onRegister?: () => void;
  onBookmark?: () => void;
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

const EventDetailCard: React.FC<EventDetailCardProps> = ({
  id,
  title,
  date,
  imageUrl,
  alt = title,
  description,
  location,
  address,
  price,
  category,
  organizer,
  organizerContacts,
  maxParticipants,
  currentParticipants,
  fulldescription,
  tags = [],
  socialLinks,
  payUrl,
  onBookmark,
}) => {
  // Состояние для модального окна изображения
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  // Состояние для модального окна шаринга
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Функции для управления диалогом изображения
  const openImageDialog = () => setIsImageDialogOpen(true);
  const closeImageDialog = () => setIsImageDialogOpen(false);

  // Функции для управления диалогом шаринга
  const openShareDialog = () => setIsShareDialogOpen(true);
  const closeShareDialog = () => setIsShareDialogOpen(false);

  // Форматирование даты и времени
  const formattedDate = format(new Date(date), 'dd MMMM yyyy', { locale: ru });
  const formattedTime = format(new Date(date), 'HH:mm', { locale: ru });
  const dayOfWeek = format(new Date(date), 'EEEE', { locale: ru });
  const formattedDayOfWeek =
    dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  // Изображение по умолчанию
  const imageSrc = imageUrl || '/images/HeaderPicture.jpg';

  // Обработчики
  const handleRegister = () => {
    // Проверяем наличие payUrl
    if (payUrl && payUrl.trim() !== '') {
      // Открываем ссылку в новой вкладке
      window.open(payUrl, '_blank', 'noopener,noreferrer');
    }
  };

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

  // Расчет заполненности
  const participationPercentage =
    maxParticipants && currentParticipants
      ? Math.round((currentParticipants / maxParticipants) * 100)
      : 0;

  // Проверяем, доступна ли ссылка для покупки
  const isPayUrlAvailable = payUrl && payUrl.trim() !== '';

  return (
    <>
      {/* Диалог для увеличенного изображения */}
      <Dialog.Root open={isImageDialogOpen} onOpenChange={closeImageDialog}>
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.800" />
          <Dialog.Positioner>
            <Dialog.Content
              bg="transparent"
              boxShadow="none"
              maxW="95vw"
              maxH="95vh"
              p={0}
              overflow="hidden"
            >
              <Dialog.Body
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={0}
                m={0}
              >
                <Box
                  position="relative"
                  onClick={closeImageDialog}
                  cursor="zoom-out"
                  maxW="100%"
                  maxH="90vh"
                >
                  <Image
                    src={imageSrc}
                    alt={alt}
                    objectFit="contain"
                    w="100%"
                    h="100%"
                    maxH="90vh"
                    borderRadius="md"
                  />
                </Box>
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size="lg"
                  color="white"
                  bg="blackAlpha.600"
                  position="fixed"
                  top={4}
                  right={4}
                  _hover={{ bg: 'blackAlpha.800' }}
                  onClick={closeImageDialog}
                />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Диалог для шаринга */}
      <Dialog.Root open={isShareDialogOpen} onOpenChange={closeShareDialog}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Поделиться мероприятием</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Text>Вы можете поделиться ссылкой на это мероприятие:</Text>
                  <Flex
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text fontSize="sm" color="gray.600" maxW="70%">
                      {window.location.href}
                    </Text>
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toaster.create({
                          title: 'Ссылка скопирована',
                          type: 'success',
                        });
                        closeShareDialog();
                      }}
                    >
                      Копировать
                    </Button>
                  </Flex>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={closeShareDialog}>
                    Закрыть
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" onClick={closeShareDialog} />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Box>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={8}>
          {/* Левая колонка - основная информация */}
          <GridItem>
            <Stack>
              {/* Категория и действия */}
              <Flex justifyContent="space-between" alignItems="center">
                {category && (
                  <Badge
                    colorScheme={getCategoryColorScheme(category)}
                    fontSize="md"
                    px={4}
                    py={2}
                    bgColor={getCategoryColorScheme(category)}
                    borderRadius="full"
                  >
                    {getCategoryLabel(category)}
                  </Badge>
                )}
              </Flex>

              {/* Заголовок */}
              <Heading as="h1" size="2xl" fontWeight="bold" color="gray.800">
                {title}
              </Heading>

              {/* Основное изображение с возможностью увеличения */}
              <Box
                borderRadius="xl"
                overflow="hidden"
                boxShadow="xl"
                position="relative"
                cursor="pointer"
                onClick={openImageDialog}
                role="group"
              >
                <Image
                  src={imageSrc}
                  alt={alt}
                  w="100%"
                  h={{ base: '300px', md: '500px' }}
                  objectFit="contain"
                  loading="eager"
                  transition="transform 0.3s"
                  _groupHover={{ transform: 'scale(1.02)' }}
                  bg="gray.50"
                />

                {/* Индикатор увеличения при наведении */}
                <Flex
                  position="absolute"
                  bottom={4}
                  right={4}
                  bg="blackAlpha.600"
                  color="white"
                  px={3}
                  py={2}
                  borderRadius="md"
                  alignItems="center"
                  gap={2}
                  opacity={0}
                  transition="opacity 0.2s"
                  _groupHover={{ opacity: 1 }}
                >
                  <Icon as={FaExpand} />
                  <Text fontSize="sm">Увеличить</Text>
                </Flex>
              </Box>

              {/* Основная информация в карточках */}
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={4}
              >
                <Box
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <Flex alignItems="center" mb={4}>
                    <Icon
                      as={FaCalendarAlt}
                      color="blue.500"
                      mr={3}
                      boxSize={5}
                    />
                    <Stack>
                      <Text fontSize="lg" fontWeight="bold">
                        {formattedDate}
                      </Text>
                      <Text color="gray.600">{formattedDayOfWeek}</Text>
                    </Stack>
                  </Flex>
                  <Flex alignItems="center">
                    <Icon as={FaClock} color="blue.500" mr={3} boxSize={5} />
                    <Text fontSize="lg">{formattedTime}</Text>
                  </Flex>
                </Box>

                <Box
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <Flex alignItems="center" mb={3}>
                    <Icon
                      as={FaMapMarkerAlt}
                      color="green.500"
                      mr={3}
                      boxSize={5}
                    />
                    <Stack>
                      <Text fontSize="lg" fontWeight="bold">
                        {location ===
                        'Калининградская область, г. Советск, ул. Победы 34 а'
                          ? 'ЦКД Парус'
                          : location}
                      </Text>
                      {address && (
                        <Text fontSize="sm" color="gray.600">
                          {address}
                        </Text>
                      )}
                    </Stack>
                  </Flex>
                  <Link
                    href={`https://maps.google.com/?q=${encodeURIComponent(location + (address ? ', ' + address : ''))}`}
                    target="_blank"
                    color="blue.500"
                    fontSize="sm"
                    textDecoration="underline"
                  >
                    Открыть в картах
                  </Link>
                </Box>
              </Grid>

              {/* Описание */}
              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.100"
              >
                <Heading as="h2" size="lg" mb={4} color="gray.800">
                  Описание мероприятия
                </Heading>
                <Text
                  fontSize="md"
                  lineHeight="1.8"
                  color="gray.700"
                  whiteSpace="pre-line"
                >
                  {fulldescription}
                </Text>
              </Box>

              {/* Теги */}
              {tags.length > 0 && (
                <Box>
                  <Heading as="h3" size="md" mb={3} color="gray.700">
                    Теги
                  </Heading>
                  <Flex flexWrap="wrap" gap={2}>
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        colorScheme="gray"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              )}

              {/* Организатор */}
              {organizer && (
                <Box
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <Heading as="h2" size="lg" mb={4} color="gray.800">
                    Организатор
                  </Heading>
                  <Stack>
                    <Text fontSize="lg" fontWeight="medium">
                      {organizer}
                    </Text>
                    {organizerContacts && (
                      <Text fontSize="md" color="gray.600">
                        {organizerContacts}
                      </Text>
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>
          </GridItem>

          {/* Правая колонка - боковая панель с действиями */}
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
              display="flex"
              justifyContent="center"
            >
              <Stack width="100%">
                {/* Цена */}
                <Box textAlign="center">
                  <Heading as="h3" size="xl" color="gray.800" mb={2}>
                    {price === 0 ? 'Бесплатно' : `${price} ₽`}
                  </Heading>
                  <Text color="gray.600">
                    {price === 0 ? 'Вход свободный' : 'Стоимость билета'}
                  </Text>
                </Box>

                {/* Кнопка регистрации/покупки */}
                <Button
                  colorScheme={isPayUrlAvailable ? 'blue' : 'gray'}
                  size="lg"
                  height="60px"
                  fontSize="lg"
                  disabled={!isPayUrlAvailable}
                  onClick={handleRegister}
                  _hover={
                    !isPayUrlAvailable ? { cursor: 'not-allowed' } : undefined
                  }
                >
                  {isPayUrlAvailable
                    ? 'Купить билет онлайн'
                    : 'Онлайн продажа недоступна'}
                </Button>

                {/* Дополнительная информация */}
                <Stack>
                  <Flex alignItems="center">
                    <Icon as={FaCalendarAlt} color="gray.500" mr={3} />
                    <Text>{formattedDate}</Text>
                  </Flex>
                  <Flex alignItems="center">
                    <Icon as={FaClock} color="gray.500" mr={3} />
                    <Text>{formattedTime}</Text>
                  </Flex>
                  <Flex alignItems="center">
                    <Icon as={FaMapMarkerAlt} color="gray.500" mr={3} />
                    <Text fontSize="sm">{location}</Text>
                  </Flex>
                </Stack>

                {/* Важная информация */}
                <Stack
                  bg="blue.50"
                  p={4}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="blue.100"
                  textAlign="center"
                >
                  <Text fontSize="sm" color="blue.800" fontWeight="medium">
                    Заказать билет можно по телефону:
                  </Text>

                  <Text>
                    <Link
                      href="tel:+7 902 423 4771"
                      fontSize="sm"
                      color="blue.700"
                      fontWeight="medium"
                    >
                      +7 902 423 4771
                    </Link>
                  </Text>

                  <Text fontSize="sm" color="blue.700">
                    Спрайнис Ольга Витальевна
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default EventDetailCard;
