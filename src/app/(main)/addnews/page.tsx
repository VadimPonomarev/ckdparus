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
  Checkbox,
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

// Схема валидации с использованием Zod
const NewsSchema = z.object({
  title: z
    .string()
    .min(5, 'Заголовок слишком короткий')
    .max(200, 'Заголовок слишком длинный')
    .nonempty('Обязательное поле'),
  excerpt: z
    .string()
    .max(500, 'Краткое описание слишком длинное')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .min(50, 'Содержание слишком короткое')
    .max(10000, 'Содержание слишком длинное')
    .nonempty('Обязательное поле'),
  videoUrl: z.string().optional().or(z.literal('')),
  isPublished: z.boolean(),
});

// Типы для формы
type NewsFormValues = z.infer<typeof NewsSchema>;

// Интерфейс для файла с предпросмотром
interface ImageFile {
  id: string;
  file: File;
  preview: string;
  alt: string;
  caption: string;
  order: number;
}

export default function AddNewsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(-1);

  // Создаем ref для file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsFormValues>({
    resolver: zodResolver(NewsSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      videoUrl: '',
      isPublished: true,
    },
    mode: 'onBlur',
  });

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

    // Если это первое изображение, делаем его обложкой
    if (images.length === 0 && newImages.length > 0) {
      setMainImageIndex(0);
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

    if (images.length === 0 && newImages.length > 0) {
      setMainImageIndex(0);
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
    if (mainImageIndex === index) {
      setMainImageIndex(newImages.length > 0 ? 0 : -1);
    } else if (mainImageIndex > index) {
      setMainImageIndex(mainImageIndex - 1);
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

    if (mainImageIndex === index) {
      setMainImageIndex(index - 1);
    } else if (mainImageIndex === index - 1) {
      setMainImageIndex(index);
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

    if (mainImageIndex === index) {
      setMainImageIndex(index + 1);
    } else if (mainImageIndex === index + 1) {
      setMainImageIndex(index);
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
  const handleSetMainImage = (index: number) => {
    setMainImageIndex(index);
  };

  // Очистка всех изображений
  const clearAllImages = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setMainImageIndex(-1);
  };

  const onSubmit: SubmitHandler<NewsFormValues> = async data => {
    try {
      setIsSubmitting(true);
      setUploadError(null);

      // Загружаем изображения на сервер
      const uploadedImages: {
        url: string;
        alt: string;
        caption: string;
        order: number;
      }[] = [];
      let mainImageUrl = null;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];

        const uploadFormData = new FormData();
        uploadFormData.append('file', img.file);
        uploadFormData.append('entityType', 'news');

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
          alt: img.alt || `Изображение ${i + 1} к новости "${data.title}"`,
          caption: img.caption,
          order: i,
        };

        uploadedImages.push(imageData);

        if (i === mainImageIndex) {
          mainImageUrl = uploadData.url;
        }
      }

      if (mainImageIndex === -1 && uploadedImages.length > 0) {
        mainImageUrl = uploadedImages[0].url;
      }

      const newsData = {
        title: data.title,
        excerpt: data.excerpt || null,
        content: data.content,
        videoUrl: data.videoUrl || null,
        imageUrl: mainImageUrl,
        images: uploadedImages,
        isPublished: data.isPublished,
      };

      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при сохранении новости');
      }

      clearAllImages();

      alert('Новость успешно создана!');
      reset();
      router.push('/');
    } catch (error) {
      console.error('Error creating news:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Ошибка при создании новости. Попробуйте еще раз.'
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
              <Heading size="xl">Добавить новую новость</Heading>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Fieldset.Root>
                  <Stack gap="6">
                    <Grid
                      templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
                      gap={6}
                    >
                      <GridItem>
                        <Stack gap="5">
                          <Field.Root invalid={!!errors.title}>
                            <Field.Label>Заголовок новости</Field.Label>
                            <Controller
                              name="title"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Введите заголовок новости"
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

                          <Field.Root invalid={!!errors.excerpt}>
                            <Field.Label>Краткое описание (анонс)</Field.Label>
                            <Controller
                              name="excerpt"
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  {...field}
                                  placeholder="Краткое описание для превью (до 500 символов)"
                                  rows={3}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            <Field.HelperText>
                              Будет отображаться в списке новостей
                            </Field.HelperText>
                            {errors.excerpt && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.excerpt.message}
                                </Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>

                          <Field.Root invalid={!!errors.content}>
                            <Field.Label>Содержание новости</Field.Label>
                            <Controller
                              name="content"
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  {...field}
                                  placeholder="Полное содержание новости"
                                  rows={10}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            <Field.HelperText>
                              Можно использовать HTML-разметку
                            </Field.HelperText>
                            {errors.content && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.content.message}
                                </Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>
                          <Field.Root invalid={!!errors.videoUrl}>
                            <Field.Label>Ссылка на видео</Field.Label>
                            <Controller
                              name="videoUrl"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Ссылка на видео"
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            {errors.videoUrl && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.videoUrl.message}
                                </Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>
                        </Stack>
                      </GridItem>

                      <GridItem>
                        <Card.Root variant="outline">
                          <Card.Body>
                            <Stack gap="4">
                              <Heading size="sm">Настройки публикации</Heading>

                              <Controller
                                name="isPublished"
                                control={control}
                                render={({ field }) => (
                                  <Checkbox.Root
                                    checked={field.value}
                                    onCheckedChange={({ checked }) =>
                                      field.onChange(checked)
                                    }
                                    cursor="pointer"
                                  >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control cursor="pointer" />
                                    <Checkbox.Label>
                                      Опубликовать сразу
                                    </Checkbox.Label>
                                  </Checkbox.Root>
                                )}
                              />
                              <Box fontSize="sm" color="gray.500" ml="7">
                                Если снять галочку, новость сохранится как
                                черновик
                              </Box>

                              <Box borderTopWidth={1} pt={4}>
                                <Text fontSize="sm" color="gray.500">
                                  • Автоматически добавится дата публикации
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  • Счетчик просмотров начнется с 0
                                </Text>
                              </Box>
                            </Stack>
                          </Card.Body>
                        </Card.Root>
                      </GridItem>
                    </Grid>

                    <Card.Root variant="outline" mt={4}>
                      <Card.Body>
                        <Stack gap="6">
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <HStack>
                              <Heading size="md">Галерея изображений</Heading>
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

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                          />

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
                                JPG, PNG, WebP до 10MB. Максимум 10 файлов
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

                          {uploadError && (
                            <Alert.Root status="error" mt={4}>
                              <Alert.Indicator />
                              <Alert.Title>{uploadError}</Alert.Title>
                            </Alert.Root>
                          )}

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
                                      <Box
                                        position="relative"
                                        w="100px"
                                        h="80px"
                                        borderRadius="md"
                                        overflow="hidden"
                                        border={
                                          mainImageIndex === index
                                            ? '3px solid'
                                            : '1px solid'
                                        }
                                        borderColor={
                                          mainImageIndex === index
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
                                        {mainImageIndex === index && (
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

                                      <HStack gap="1">
                                        <IconButton
                                          aria-label="Сделать обложкой"
                                          size="sm"
                                          variant={
                                            mainImageIndex === index
                                              ? 'solid'
                                              : 'ghost'
                                          }
                                          colorPalette={
                                            mainImageIndex === index
                                              ? 'blue'
                                              : 'gray'
                                          }
                                          onClick={() =>
                                            handleSetMainImage(index)
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
                                Изображения не загружены. Загрузите фотографии
                                для галереи новости.
                              </Text>
                              <Text fontSize="sm" color="gray.500" mt={2}>
                                Первое изображение автоматически станет обложкой
                                новости
                              </Text>
                            </Box>
                          )}
                        </Stack>
                      </Card.Body>
                    </Card.Root>

                    <Card.Footer justifyContent="flex-end" gap="3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/news')}
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
                        Создать новость
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
