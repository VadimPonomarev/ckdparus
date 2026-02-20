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
} from 'react-icons/fa';
import { useState } from 'react';
import { toaster } from '@/components/ui/toaster'; // Импортируем toaster

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
  onRegister,
  onBookmark,
}) => {
  // Заменяем useDisclosure на useState
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Функции для управления модальным окном
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    if (onRegister) {
      onRegister();
    } else {
      toaster.create({
        title: 'Регистрация',
        description: 'Вы успешно зарегистрировались на мероприятие!',
        type: 'success',
      });
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      openModal();
    }
  };

  // Расчет заполненности
  const participationPercentage =
    maxParticipants && currentParticipants
      ? Math.round((currentParticipants / maxParticipants) * 100)
      : 0;

  return (
    <>
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

                <Flex gap={3}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    px={10}
                  >
                    Поделиться
                  </Button>
                </Flex>
              </Flex>

              {/* Заголовок */}
              <Heading as="h1" size="2xl" fontWeight="bold" color="gray.800">
                {title}
              </Heading>

              {/* Основное изображение */}
              <Box
                borderRadius="xl"
                overflow="hidden"
                boxShadow="xl"
                position="relative"
              >
                <Image
                  src={imageSrc}
                  alt={alt}
                  w="100%"
                  h={{ base: '300px', md: '500px' }}
                  objectFit="contain"
                  loading="eager"
                />
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
                          ? 'ЦКД Парсу'
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
              <Stack>
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
                  colorScheme="blue"
                  size="lg"
                  height="60px"
                  fontSize="lg"
                  onClick={handleRegister}
                >
                  {price === 0 ? 'Зарегистрироваться' : 'Купить билет'}
                </Button>

                {/* Информация о количестве участников */}
                {maxParticipants && (
                  <Box>
                    <Flex justifyContent="space-between" mb={2}>
                      <Text color="gray.600">Зарегистрировано:</Text>
                      <Text fontWeight="bold">
                        {currentParticipants || 0}/{maxParticipants}
                      </Text>
                    </Flex>
                    <Box
                      w="100%"
                      bg="gray.100"
                      borderRadius="full"
                      overflow="hidden"
                      h="8px"
                    >
                      <Box
                        w={`${participationPercentage}%`}
                        h="100%"
                        bg={
                          participationPercentage >= 90
                            ? 'red.400'
                            : 'green.400'
                        }
                        transition="width 0.3s ease"
                      />
                    </Box>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      mt={2}
                      textAlign="center"
                    >
                      {participationPercentage >= 90
                        ? 'Осталось мало мест!'
                        : participationPercentage >= 70
                          ? 'Места заканчиваются'
                          : 'Доступно мест'}
                    </Text>
                  </Box>
                )}

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

                {/* Социальные сети мероприятия */}
                {(socialLinks?.instagram ||
                  socialLinks?.vk ||
                  socialLinks?.telegram) && (
                  <>
                    <Box>
                      <Text fontWeight="medium" mb={3}>
                        Следите за мероприятием:
                      </Text>
                      <Flex gap={3} justifyContent="center">
                        {socialLinks.instagram && (
                          <Link href={socialLinks.instagram} target="_blank">
                            <Icon
                              as={FaInstagram}
                              boxSize={6}
                              color="pink.500"
                            />
                          </Link>
                        )}
                        {socialLinks.vk && (
                          <Link href={socialLinks.vk} target="_blank">
                            <Icon as={FaVk} boxSize={6} color="blue.600" />
                          </Link>
                        )}
                        {socialLinks.telegram && (
                          <Link href={socialLinks.telegram} target="_blank">
                            <Icon
                              as={FaTelegram}
                              boxSize={6}
                              color="blue.400"
                            />
                          </Link>
                        )}
                      </Flex>
                    </Box>
                  </>
                )}

                {/* Важная информация */}
                <Box
                  bg="blue.50"
                  p={4}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="blue.100"
                >
                  <Text
                    fontSize="sm"
                    color="blue.800"
                    fontWeight="medium"
                    mb={2}
                  >
                    📋 Важная информация
                  </Text>
                  <Text fontSize="sm" color="blue.700">
                    • Регистрация обязательна
                    <br />
                    • Приходите за 15 минут до начала
                    <br />• Возьмите с собой документ, удостоверяющий личность
                  </Text>
                </Box>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default EventDetailCard;
