'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Fieldset,
  Input,
  Textarea,
  Stack,
  Heading,
  Alert,
  HStack,
  VStack,
  Image,
  Text,
  IconButton,
  Grid,
  GridItem,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HiX } from 'react-icons/hi';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import AuthGuard from '@/components/auth/AuthGuard';

// Функция для транслитерации кириллицы в латиницу
const transliterate = (text: string): string => {
  const map: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    А: 'A',
    Б: 'B',
    В: 'V',
    Г: 'G',
    Д: 'D',
    Е: 'E',
    Ё: 'E',
    Ж: 'Zh',
    З: 'Z',
    И: 'I',
    Й: 'Y',
    К: 'K',
    Л: 'L',
    М: 'M',
    Н: 'N',
    О: 'O',
    П: 'P',
    Р: 'R',
    С: 'S',
    Т: 'T',
    У: 'U',
    Ф: 'F',
    Х: 'Kh',
    Ц: 'Ts',
    Ч: 'Ch',
    Ш: 'Sh',
    Щ: 'Shch',
    Ъ: '',
    Ы: 'Y',
    Ь: '',
    Э: 'E',
    Ю: 'Yu',
    Я: 'Ya',
  };

  return text
    .split('')
    .map(char => map[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Удаляем все кроме букв, цифр, пробелов и дефисов
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Убираем множественные дефисы
    .replace(/^-|-$/g, ''); // Убираем дефисы в начале и конце
};

// Схема валидации с использованием Zod
const GallerySchema = z.object({
  title: z
    .string()
    .min(3, 'Название слишком короткое')
    .max(100, 'Название слишком длинное')
    .nonempty('Обязательное поле'),
  description: z
    .string()
    .max(500, 'Описание слишком длинное')
    .optional()
    .or(z.literal('')),
  slug: z
    .string()
    .min(3, 'URL слишком короткий')
    .max(100, 'URL слишком длинный')
    .regex(
      /^[a-z0-9-]+$/,
      'URL может содержать только латинские буквы, цифры и дефисы'
    )
    .optional()
    .or(z.literal('')),
});

// Типы для формы
type GalleryFormValues = z.infer<typeof GallerySchema>;

// Интерфейс для файла с предпросмотром
interface ImageFile {
  id: string;
  file: File;
  preview: string;
  alt: string;
  caption: string;
  order: number;
}

export default function AddGalleryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(-1);
  const [slug, setSlug] = useState<string>('');

  // Создаем ref для file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(GallerySchema),
    defaultValues: {
      title: '',
      description: '',
      slug: '',
    },
    mode: 'onBlur',
  });

  // Отслеживаем изменение title для автоматической генерации slug
  const title = watch('title');

  // Генерируем slug при изменении title
  const generateSlug = () => {
    if (title) {
      const generatedSlug = transliterate(title);
      setSlug(generatedSlug);
      setValue('slug', generatedSlug);
    }
  };

  // Обработка выбора файлов через input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: ImageFile[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`,
      file,
      preview: URL.createObjectURL(file),
      alt: '',
      caption: '',
      order: images.length + index,
    }));

    setImages(prevImages => [...prevImages, ...newImages]);

    // Если это первое изображение и обложка еще не выбрана, делаем его обложкой
    if (images.length === 0 && newImages.length > 0 && coverImageIndex === -1) {
      setCoverImageIndex(0);
    }

    setUploadError(null);

    // Сбрасываем input, чтобы можно было выбрать тот же файл снова
    event.target.value = '';
  };

  // Обработка drag & drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newImages: ImageFile[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`,
      file,
      preview: URL.createObjectURL(file),
      alt: '',
      caption: '',
      order: images.length + index,
    }));

    setImages(prevImages => [...prevImages, ...newImages]);

    if (images.length === 0 && newImages.length > 0 && coverImageIndex === -1) {
      setCoverImageIndex(0);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Удаление изображения
  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index];
    URL.revokeObjectURL(imageToRemove.preview);

    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    // Корректируем порядок
    newImages.forEach((img, idx) => {
      img.order = idx;
    });

    // Корректируем индекс обложки
    if (coverImageIndex === index) {
      setCoverImageIndex(newImages.length > 0 ? 0 : -1);
    } else if (coverImageIndex > index) {
      setCoverImageIndex(coverImageIndex - 1);
    }
  };

  // Перемещение изображения вверх
  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [
      newImages[index],
      newImages[index - 1],
    ];

    newImages.forEach((img, idx) => {
      img.order = idx;
    });

    setImages(newImages);

    if (coverImageIndex === index) {
      setCoverImageIndex(index - 1);
    } else if (coverImageIndex === index - 1) {
      setCoverImageIndex(index);
    }
  };

  // Перемещение изображения вниз
  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;

    const newImages = [...images];
    [newImages[index + 1], newImages[index]] = [
      newImages[index],
      newImages[index + 1],
    ];

    newImages.forEach((img, idx) => {
      img.order = idx;
    });

    setImages(newImages);

    if (coverImageIndex === index) {
      setCoverImageIndex(index + 1);
    } else if (coverImageIndex === index + 1) {
      setCoverImageIndex(index);
    }
  };

  // Обновление alt текста
  const handleAltChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index].alt = value;
    setImages(newImages);
  };

  // Обновление подписи
  const handleCaptionChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index].caption = value;
    setImages(newImages);
  };

  // Установка обложки
  const handleSetCoverImage = (index: number) => {
    setCoverImageIndex(index);
  };

  // Очистка всех изображений
  const clearAllImages = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setCoverImageIndex(-1);
  };

  const onSubmit: SubmitHandler<GalleryFormValues> = async data => {
    try {
      setIsSubmitting(true);
      setUploadError(null);

      if (images.length === 0) {
        setUploadError('Добавьте хотя бы одно изображение');
        setIsSubmitting(false);
        return;
      }

      // Загружаем изображения на сервер
      const uploadedImages: {
        url: string;
        alt: string;
        caption: string;
        order: number;
      }[] = [];
      let coverImageUrl = null;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];

        // Создаем FormData для загрузки файла
        const uploadFormData = new FormData();
        uploadFormData.append('file', img.file);
        uploadFormData.append('entityType', 'gallery');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(
            errorData.error || `Ошибка загрузки изображения ${i + 1}`
          );
        }

        const uploadData = await uploadResponse.json();

        const imageData = {
          url: uploadData.url,
          alt: img.alt || `Изображение ${i + 1} из галереи "${data.title}"`,
          caption: img.caption,
          order: i,
        };

        uploadedImages.push(imageData);

        // Если это обложка, сохраняем URL
        if (i === coverImageIndex) {
          coverImageUrl = uploadData.url;
        }
      }

      // Если не выбрана обложка, используем первое изображение
      if (coverImageIndex === -1 && uploadedImages.length > 0) {
        coverImageUrl = uploadedImages[0].url;
      }

      // Используем slug из формы или генерируем из title
      const finalSlug = data.slug || transliterate(data.title);

      const galleryData = {
        title: data.title,
        description: data.description || null,
        slug: finalSlug,
        coverImage: coverImageUrl,
        images: uploadedImages,
      };

      const response = await fetch('/api/galleries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(galleryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при сохранении галереи');
      }

      // Освобождаем память от preview URL
      clearAllImages();

      alert('Галерея успешно создана!');
      reset();
      router.push('/admin/galleries');
    } catch (error) {
      console.error('Error creating gallery:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Ошибка при создании галереи. Попробуйте еще раз.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <Container maxW="container.xl" py={8}>
        <Card.Root>
          <Card.Body p={{ base: 6, md: 10 }}>
            <Stack gap="6">
              <Heading size="xl">Добавить новую галерею</Heading>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Fieldset.Root>
                  <Stack gap="6">
                    {/* Основная информация */}
                    <Grid
                      templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
                      gap={6}
                    >
                      {/* Левая колонка - текст */}
                      <GridItem>
                        <Stack gap="5">
                          {/* Название галереи */}
                          <Field.Root invalid={!!errors.title}>
                            <Field.Label>Название галереи</Field.Label>
                            <Controller
                              name="title"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Введите название галереи"
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            {errors.title && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.title.message}
                                </Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>

                          {/* Описание */}
                          <Field.Root invalid={!!errors.description}>
                            <Field.Label>Описание</Field.Label>
                            <Controller
                              name="description"
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  {...field}
                                  placeholder="Краткое описание галереи (до 500 символов)"
                                  rows={4}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            <Field.HelperText>
                              Будет отображаться на странице галереи
                            </Field.HelperText>
                            {errors.description && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.description.message}
                                </Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>

                          {/* URL (slug) */}
                          <Field.Root invalid={!!errors.slug}>
                            <Field.Label>URL адрес</Field.Label>
                            <HStack>
                              <Controller
                                name="slug"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="url-адres-galerei"
                                    onBlur={field.onBlur}
                                    value={field.value || slug}
                                    onChange={e => {
                                      field.onChange(e);
                                      setSlug(e.target.value);
                                    }}
                                  />
                                )}
                              />
                              <Button
                                onClick={generateSlug}
                                variant="outline"
                                size="md"
                                whiteSpace="nowrap"
                              >
                                Сгенерировать
                              </Button>
                            </HStack>
                            <Field.HelperText>
                              Будет использоваться в адресе страницы: /gallery/
                              {slug || 'url-address'}
                            </Field.HelperText>
                            {errors.slug && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>{errors.slug.message}</Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>
                        </Stack>
                      </GridItem>

                      {/* Правая колонка - информация */}
                      <GridItem>
                        <Card.Root variant="outline">
                          <Card.Body>
                            <Stack gap="4">
                              <Heading size="sm">Информация</Heading>
                              <Box fontSize="sm" color="gray.500">
                                <Text>
                                  • После создания галереи вы сможете:
                                </Text>
                                <Text ml={4}>
                                  - Добавлять и удалять фотографии
                                </Text>
                                <Text ml={4}>- Изменять порядок фото</Text>
                                <Text ml={4}>
                                  - Редактировать название и описание
                                </Text>
                                <Text mt={2}>
                                  • Первое изображение автоматически станет
                                  обложкой, если не выбрано другое
                                </Text>
                                <Text mt={2}>
                                  • Рекомендуемый размер фото: 1920x1080px
                                </Text>
                              </Box>
                            </Stack>
                          </Card.Body>
                        </Card.Root>
                      </GridItem>
                    </Grid>

                    {/* Блок загрузки изображений */}
                    <Card.Root variant="outline" mt={4}>
                      <Card.Body>
                        <Stack gap="6">
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <HStack>
                              <Heading size="md">Фотографии галереи</Heading>
                              {images.length > 0 && (
                                <Badge colorPalette="blue" size="lg">
                                  {images.length}{' '}
                                  {images.length === 1 ? 'фото' : 'фото'}
                                </Badge>
                              )}
                            </HStack>

                            {images.length > 0 && (
                              <Button
                                variant="ghost"
                                colorPalette="red"
                                size="sm"
                                onClick={clearAllImages}
                              >
                                Очистить все
                              </Button>
                            )}
                          </Flex>

                          {/* Скрытый input для выбора файлов */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                          />

                          {/* Зона загрузки */}
                          <Box
                            borderWidth={2}
                            borderStyle="dashed"
                            borderRadius="lg"
                            bg="gray.50"
                            _dark={{ bg: 'gray.800' }}
                            p={8}
                            textAlign="center"
                            cursor="pointer"
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            _hover={{
                              bg: 'gray.100',
                              _dark: { bg: 'gray.700' },
                            }}
                            transition="all 0.2s"
                          >
                            <VStack gap="3">
                              <Text textAlign="center" fontWeight="medium">
                                Нажмите для выбора или перетащите сюда
                                изображения
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                JPG, PNG, WebP до 10MB
                              </Text>
                              <Button
                                variant="outline"
                                size="sm"
                                px={10}
                                onClick={e => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                              >
                                Выберите файлы
                              </Button>
                            </VStack>
                          </Box>

                          {/* Ошибки загрузки */}
                          {uploadError && (
                            <Alert.Root status="error" mt={4}>
                              <Alert.Indicator />
                              <Alert.Title>{uploadError}</Alert.Title>
                            </Alert.Root>
                          )}

                          {/* Список загруженных изображений */}
                          {images.length > 0 && (
                            <VStack gap="4" align="stretch" mt={4}>
                              <Text fontWeight="medium" fontSize="sm">
                                Загруженные изображения ({images.length}):
                              </Text>

                              {images.map((image, index) => (
                                <Card.Root
                                  key={image.id}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Card.Body>
                                    <Grid
                                      templateColumns="auto 1fr auto"
                                      gap={4}
                                      alignItems="center"
                                    >
                                      {/* Превью */}
                                      <Box
                                        position="relative"
                                        w="100px"
                                        h="80px"
                                        borderRadius="md"
                                        overflow="hidden"
                                        border={
                                          coverImageIndex === index
                                            ? '3px solid'
                                            : '1px solid'
                                        }
                                        borderColor={
                                          coverImageIndex === index
                                            ? 'blue.500'
                                            : 'gray.200'
                                        }
                                      >
                                        <Image
                                          src={image.preview}
                                          alt={image.alt || 'Превью'}
                                          w="100%"
                                          h="100%"
                                          objectFit="cover"
                                        />
                                        {coverImageIndex === index && (
                                          <Badge
                                            position="absolute"
                                            top={1}
                                            left={1}
                                            colorPalette="blue"
                                            size="sm"
                                          >
                                            Обложка
                                          </Badge>
                                        )}
                                      </Box>

                                      {/* Информация */}
                                      <Stack gap="2">
                                        <Input
                                          placeholder="Alt текст (для SEO)"
                                          size="sm"
                                          value={image.alt}
                                          onChange={e =>
                                            handleAltChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                        />
                                        <Input
                                          placeholder="Подпись к фото"
                                          size="sm"
                                          value={image.caption}
                                          onChange={e =>
                                            handleCaptionChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </Stack>

                                      {/* Действия */}
                                      <HStack gap="1">
                                        <IconButton
                                          aria-label="Сделать обложкой"
                                          size="sm"
                                          variant={
                                            coverImageIndex === index
                                              ? 'solid'
                                              : 'ghost'
                                          }
                                          colorPalette={
                                            coverImageIndex === index
                                              ? 'blue'
                                              : 'gray'
                                          }
                                          onClick={() =>
                                            handleSetCoverImage(index)
                                          }
                                          title="Сделать обложкой"
                                        >
                                          ⭐
                                        </IconButton>

                                        <IconButton
                                          aria-label="Переместить вверх"
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleMoveUp(index)}
                                          disabled={index === 0}
                                        >
                                          <FaArrowUp />
                                        </IconButton>

                                        <IconButton
                                          aria-label="Переместить вниз"
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleMoveDown(index)}
                                          disabled={index === images.length - 1}
                                        >
                                          <FaArrowDown />
                                        </IconButton>

                                        <IconButton
                                          aria-label="Удалить"
                                          size="sm"
                                          colorPalette="red"
                                          variant="ghost"
                                          onClick={() =>
                                            handleRemoveImage(index)
                                          }
                                        >
                                          <HiX />
                                        </IconButton>
                                      </HStack>
                                    </Grid>
                                  </Card.Body>
                                </Card.Root>
                              ))}
                            </VStack>
                          )}

                          {images.length === 0 && (
                            <Box
                              p={8}
                              borderWidth={1}
                              borderRadius="lg"
                              textAlign="center"
                              bg="gray.50"
                              _dark={{ bg: 'gray.800' }}
                            >
                              <Text color="gray.500">
                                Фотографии не загружены. Добавьте изображения
                                для галереи.
                              </Text>
                              <Text fontSize="sm" color="gray.500" mt={2}>
                                Первое изображение автоматически станет обложкой
                                галереи
                              </Text>
                            </Box>
                          )}
                        </Stack>
                      </Card.Body>
                    </Card.Root>

                    {/* Кнопки */}
                    <Card.Footer justifyContent="flex-end" gap="3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/galleries')}
                        px={5}
                      >
                        Отмена
                      </Button>
                      <Button
                        type="submit"
                        colorPalette="blue"
                        loading={isSubmitting}
                        px={5}
                        loadingText="Создание..."
                      >
                        Создать галерею
                      </Button>
                    </Card.Footer>
                  </Stack>
                </Fieldset.Root>
              </form>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Container>
    </AuthGuard>
  );
}
