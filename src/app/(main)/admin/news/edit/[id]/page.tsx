// app/admin/news/edit/[id]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Input,
  Textarea,
  Checkbox,
  Stack,
  Heading,
  HStack,
  Image,
  VStack,
  Text,
  Spinner,
  Center,
  Alert,
  IconButton,
  Grid,
  GridItem,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HiX } from 'react-icons/hi';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import AuthGuard from '@/components/auth/AuthGuard';

// Схема валидации для новости
const NewsSchema = z.object({
  title: z
    .string()
    .min(5, 'Заголовок слишком короткий')
    .max(200, 'Заголовок слишком длинный')
    .nonempty('Обязательное поле'),
  content: z
    .string()
    .min(20, 'Содержание слишком короткое')
    .max(10000, 'Содержание слишком длинное')
    .nonempty('Обязательное поле'),
  excerpt: z
    .string()
    .max(300, 'Краткое описание не должно превышать 300 символов')
    .optional()
    .or(z.literal('')),
  videoUrl: z.string().optional().or(z.literal('')),
  isPublished: z.boolean(),
});

type NewsFormValues = z.infer<typeof NewsSchema>;

// Интерфейс для существующего изображения из БД
interface ExistingImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  order: number;
}

// Интерфейс для нового загружаемого файла
interface NewImageFile {
  id: string;
  file: File;
  preview: string;
  alt: string;
  caption: string;
  order: number;
}

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояния для изображений
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<NewImageFile[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(-1);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<string | null>(null);
  const [newMainImageFile, setNewMainImageFile] = useState<File | null>(null);
  const [newMainImagePreview, setNewMainImagePreview] = useState<string | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(NewsSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      videoUrl: '',
      isPublished: true,
    },
    mode: 'onBlur',
  });

  // Загрузка данных новости
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/news/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Новость не найдена');
          }
          throw new Error('Ошибка загрузки новости');
        }

        const news = await response.json();

        reset({
          title: news.title,
          content: news.content,
          excerpt: news.excerpt || '',
          videoUrl: news.videoUrl || '',
          isPublished: news.isPublished ?? true,
        });

        // Загружаем существующие изображения
        if (news.images && news.images.length > 0) {
          const loadedImages = news.images.map((img: any, idx: number) => ({
            id: img.id || `existing-${idx}`,
            url: img.url,
            alt: img.alt || '',
            caption: img.caption || '',
            order: img.order !== undefined ? img.order : idx,
          }));

          // Сортируем по order
          loadedImages.sort((a: ExistingImage, b: ExistingImage) => a.order - b.order);
          setExistingImages(loadedImages);

          // Находим индекс главного изображения
          if (news.imageUrl) {
            setExistingMainImageUrl(news.imageUrl);
            const mainImgIndex = loadedImages.findIndex((img: ExistingImage) => img.url === news.imageUrl);
            setMainImageIndex(mainImgIndex !== -1 ? mainImgIndex : -1);
          } else {
            setExistingMainImageUrl(null);
            setMainImageIndex(-1);
          }
        } else if (news.imageUrl) {
          // Если есть только главное изображение без галереи
          setExistingMainImageUrl(news.imageUrl);
          setMainImageIndex(-1);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id, reset]);

  // Очистка превью при размонтировании
  useEffect(() => {
    return () => {
      newImages.forEach(img => URL.revokeObjectURL(img.preview));
      if (newMainImagePreview) URL.revokeObjectURL(newMainImagePreview);
    };
  }, [newImages, newMainImagePreview]);

  // Обработка выбора главного изображения
  const handleMainImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Файл слишком большой. Максимум 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Пожалуйста, выберите изображение');
      return;
    }

    if (newMainImagePreview) {
      URL.revokeObjectURL(newMainImagePreview);
    }

    setNewMainImageFile(file);
    setNewMainImagePreview(URL.createObjectURL(file));
    setUploadError(null);
  };

  // Удаление главного изображения
  const handleRemoveMainImage = () => {
    if (newMainImagePreview) {
      URL.revokeObjectURL(newMainImagePreview);
      setNewMainImageFile(null);
      setNewMainImagePreview(null);
    } else {
      setExistingMainImageUrl(null);
      setMainImageIndex(-1);
    }
  };

  // Обработка выбора файлов для галереи
  const handleGalleryFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImageFiles: NewImageFile[] = Array.from(files).map((file, index) => ({
      id: `new-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`,
      file,
      preview: URL.createObjectURL(file),
      alt: '',
      caption: '',
      order: existingImages.length + newImages.length + index,
    }));

    setNewImages(prev => [...prev, ...newImageFiles]);
    setUploadError(null);
    event.target.value = '';
  };

  // Drag & drop для галереи
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newImageFiles: NewImageFile[] = Array.from(files).map((file, index) => ({
      id: `new-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`,
      file,
      preview: URL.createObjectURL(file),
      alt: '',
      caption: '',
      order: existingImages.length + newImages.length + index,
    }));

    setNewImages(prev => [...prev, ...newImageFiles]);
    setUploadError(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Удаление существующего изображения
  const handleRemoveExistingImage = (image: ExistingImage) => {
    setDeletedImageIds(prev => [...prev, image.id]);
    setExistingImages(prev => prev.filter(img => img.id !== image.id));

    const currentIndex = existingImages.findIndex(img => img.id === image.id);
    if (mainImageIndex === currentIndex) {
      setMainImageIndex(-1);
    } else if (mainImageIndex > currentIndex) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  // Удаление нового изображения
  const handleRemoveNewImage = (index: number) => {
    const imageToRemove = newImages[index];
    URL.revokeObjectURL(imageToRemove.preview);
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Обновление alt текста существующего изображения
  const handleExistingImageAltChange = (imageId: string, value: string) => {
    setExistingImages(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, alt: value } : img
      )
    );
  };

  // Обновление подписи существующего изображения
  const handleExistingImageCaptionChange = (imageId: string, value: string) => {
    setExistingImages(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, caption: value } : img
      )
    );
  };

  // Обновление alt текста нового изображения
  const handleNewImageAltChange = (index: number, value: string) => {
    setNewImages(prev =>
      prev.map((img, i) =>
        i === index ? { ...img, alt: value } : img
      )
    );
  };

  // Обновление подписи нового изображения
  const handleNewImageCaptionChange = (index: number, value: string) => {
    setNewImages(prev =>
      prev.map((img, i) =>
        i === index ? { ...img, caption: value } : img
      )
    );
  };

  // Перемещение существующего изображения вверх
  const handleMoveExistingUp = (index: number) => {
    if (index === 0) return;
    const newImagesList = [...existingImages];
    [newImagesList[index - 1], newImagesList[index]] = [newImagesList[index], newImagesList[index - 1]];
    setExistingImages(newImagesList);

    if (mainImageIndex === index) {
      setMainImageIndex(index - 1);
    } else if (mainImageIndex === index - 1) {
      setMainImageIndex(index);
    }
  };

  // Перемещение существующего изображения вниз
  const handleMoveExistingDown = (index: number) => {
    if (index === existingImages.length - 1) return;
    const newImagesList = [...existingImages];
    [newImagesList[index + 1], newImagesList[index]] = [newImagesList[index], newImagesList[index + 1]];
    setExistingImages(newImagesList);

    if (mainImageIndex === index) {
      setMainImageIndex(index + 1);
    } else if (mainImageIndex === index + 1) {
      setMainImageIndex(index);
    }
  };

  // Перемещение нового изображения вверх
  const handleMoveNewUp = (index: number) => {
    if (index === 0) return;
    const newImagesList = [...newImages];
    [newImagesList[index - 1], newImagesList[index]] = [newImagesList[index], newImagesList[index - 1]];
    setNewImages(newImagesList);
  };

  // Перемещение нового изображения вниз
  const handleMoveNewDown = (index: number) => {
    if (index === newImages.length - 1) return;
    const newImagesList = [...newImages];
    [newImagesList[index + 1], newImagesList[index]] = [newImagesList[index], newImagesList[index + 1]];
    setNewImages(newImagesList);
  };

  // Установка обложки из существующих изображений
  const handleSetMainFromExisting = (index: number) => {
    setMainImageIndex(index);
    if (newMainImageFile) {
      if (newMainImagePreview) URL.revokeObjectURL(newMainImagePreview);
      setNewMainImageFile(null);
      setNewMainImagePreview(null);
    }
  };

  // Очистка всех изображений
  const clearAllImages = () => {
    newImages.forEach(img => URL.revokeObjectURL(img.preview));
    setNewImages([]);
    setExistingImages([]);
    setDeletedImageIds([]);
    setMainImageIndex(-1);
    if (newMainImagePreview) URL.revokeObjectURL(newMainImagePreview);
    setNewMainImageFile(null);
    setNewMainImagePreview(null);
    setExistingMainImageUrl(null);
  };

  const onSubmit = async (data: NewsFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setUploadError(null);

      let finalMainImageUrl: string | null = null;

      if (newMainImageFile) {
        const formData = new FormData();
        formData.append('file', newMainImageFile);
        formData.append('entityType', 'news');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Ошибка загрузки главного изображения');
        }

        const uploadData = await uploadResponse.json();
        finalMainImageUrl = uploadData.url;
      } else if (mainImageIndex !== -1 && existingImages[mainImageIndex]) {
        finalMainImageUrl = existingImages[mainImageIndex].url;
      } else if (existingMainImageUrl) {
        finalMainImageUrl = existingMainImageUrl;
      }

      const uploadedNewImages = [];
      for (let i = 0; i < newImages.length; i++) {
        const img = newImages[i];
        const formData = new FormData();
        formData.append('file', img.file);
        formData.append('entityType', 'news');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || `Ошибка загрузки изображения ${i + 1}`);
        }

        const uploadData = await uploadResponse.json();

        uploadedNewImages.push({
          url: uploadData.url,
          alt: img.alt || `Изображение к новости "${data.title}"`,
          caption: img.caption,
          order: existingImages.length + i,
        });
      }

      const allImages = [
        ...existingImages.map((img, idx) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          caption: img.caption,
          order: idx,
        })),
        ...uploadedNewImages,
      ];

      const newsData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        videoUrl: data.videoUrl || null,
        imageUrl: finalMainImageUrl,
        images: allImages,
        isPublished: data.isPublished,
        deletedImageIds: deletedImageIds.length > 0 ? deletedImageIds : undefined,
      };

      const response = await fetch(`/api/news/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при обновлении новости');
      }

      clearAllImages();
      router.push(`/news/${id}`);
    } catch (error) {
      console.error('Error updating news:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Ошибка при обновлении новости. Попробуйте еще раз.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <Container maxW="container.xl" py={8}>
          <Center minH="400px">
            <VStack gap="4">
              <Spinner size="xl" />
              <Text>Загрузка данных новости...</Text>
            </VStack>
          </Center>
        </Container>
      </AuthGuard>
    );
  }

  if (error && !isLoading) {
    return (
      <AuthGuard>
        <Container maxW="container.xl" py={8}>
          <VStack gap="4">
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Title>{error}</Alert.Title>
            </Alert.Root>
            <Center mt={4}>
              <Button onClick={() => router.push('/admin/news')}>
                Вернуться к списку
              </Button>
            </Center>
          </VStack>
        </Container>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Container maxW="container.xl" py={8}>
        <Card.Root>
          <Card.Body p={{ base: 6, md: 10 }}>
            <Stack gap="6">
              <Heading size="xl">Редактировать новость</Heading>

              {error && (
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Title>{error}</Alert.Title>
                </Alert.Root>
              )}

              {uploadError && (
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Title>{uploadError}</Alert.Title>
                </Alert.Root>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack gap="6">
                  <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
                    {/* Левая колонка - основные поля */}
                    <GridItem>
                      <Stack gap="5">
                        {/* Заголовок */}
                        <Field.Root invalid={!!errors.title}>
                          <Field.Label>Заголовок</Field.Label>
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
                            <Field.ErrorText>{errors.title.message}</Field.ErrorText>
                          )}
                        </Field.Root>

                        {/* Краткое описание */}
                        <Field.Root invalid={!!errors.excerpt}>
                          <Field.Label>Краткое описание</Field.Label>
                          <Controller
                            name="excerpt"
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder="Краткое описание (до 300 символов)"
                                rows={3}
                                maxLength={300}
                                onBlur={field.onBlur}
                              />
                            )}
                          />
                          <Field.HelperText>
                            Будет отображаться в превью новости
                          </Field.HelperText>
                          {errors.excerpt && (
                            <Field.ErrorText>{errors.excerpt.message}</Field.ErrorText>
                          )}
                        </Field.Root>

                        {/* Содержание */}
                        <Field.Root invalid={!!errors.content}>
                          <Field.Label>Содержание</Field.Label>
                          <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder="Полный текст новости"
                                rows={10}
                                onBlur={field.onBlur}
                              />
                            )}
                          />
                          {errors.content && (
                            <Field.ErrorText>{errors.content.message}</Field.ErrorText>
                          )}
                        </Field.Root>

                        {/* Видео */}
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
                            <Field.ErrorText>{errors.videoUrl.message}</Field.ErrorText>
                          )}
                        </Field.Root>
                      </Stack>
                    </GridItem>

                    {/* Правая колонка - настройки */}
                    <GridItem>
                      <Card.Root variant="outline">
                        <Card.Body>
                          <Stack gap="4">
                            <Heading size="sm">Настройки публикации</Heading>

                            <Field.Root>
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
                                    <Checkbox.Label>Опубликовано</Checkbox.Label>
                                  </Checkbox.Root>
                                )}
                              />
                              <Field.HelperText>
                                Если снять галочку, новость будет видна только администраторам
                              </Field.HelperText>
                            </Field.Root>
                          </Stack>
                        </Card.Body>
                      </Card.Root>
                    </GridItem>
                  </Grid>

                  {/* Главное изображение */}
                  <Card.Root variant="outline">
                    <Card.Body>
                      <Field.Root>
                        <Field.Label>Главное изображение</Field.Label>

                        <input
                          ref={mainImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageSelect}
                          style={{ display: 'none' }}
                        />

                        {(existingMainImageUrl || newMainImagePreview) ? (
                          <Box position="relative" display="inline-block">
                            <Image
                              src={newMainImagePreview || existingMainImageUrl || ''}
                              alt="Главное изображение"
                              borderRadius="md"
                              maxH="200px"
                              objectFit="cover"
                            />
                            <Button
                              size="xs"
                              colorPalette="red"
                              position="absolute"
                              top={2}
                              right={2}
                              onClick={handleRemoveMainImage}
                            >
                              <HiX />
                            </Button>
                          </Box>
                        ) : (
                          <Box
                            borderWidth={2}
                            borderStyle="dashed"
                            borderRadius="lg"
                            bg="gray.50"
                            _dark={{ bg: 'gray.800' }}
                            p={8}
                            textAlign="center"
                            cursor="pointer"
                            onClick={() => mainImageInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            _hover={{
                              bg: 'gray.100',
                              _dark: { bg: 'gray.700' },
                            }}
                          >
                            <VStack gap="3">
                              <Text textAlign="center" fontWeight="medium">
                                Нажмите для выбора или перетащите изображение
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                JPG, PNG, WebP до 5MB
                              </Text>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={e => {
                                  e.stopPropagation();
                                  mainImageInputRef.current?.click();
                                }}
                              >
                                Выберите файл
                              </Button>
                            </VStack>
                          </Box>
                        )}
                        <Field.HelperText>
                          Изображение будет отображаться в карточке новости и в шапке
                        </Field.HelperText>
                      </Field.Root>
                    </Card.Body>
                  </Card.Root>

                  {/* Галерея изображений */}
                  <Card.Root variant="outline">
                    <Card.Body>
                      <Stack gap="6">
                        <Flex justifyContent="space-between" alignItems="center">
                          <HStack>
                            <Heading size="md">Галерея изображений</Heading>
                            {(existingImages.length + newImages.length) > 0 && (
                              <Badge colorPalette="blue" size="lg">
                                {existingImages.length + newImages.length}{' '}
                                {(existingImages.length + newImages.length) === 1 ? 'фото' : 'фото'}
                              </Badge>
                            )}
                          </HStack>
                          {(existingImages.length > 0 || newImages.length > 0) && (
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
                          onChange={handleGalleryFilesSelect}
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
                        >
                          <VStack gap="3">
                            <Text textAlign="center" fontWeight="medium">
                              Нажмите для выбора или перетащите сюда изображения
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              JPG, PNG, WebP до 10MB. Можно выбрать несколько файлов
                            </Text>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                            >
                              Выберите файлы
                            </Button>
                          </VStack>
                        </Box>

                        {/* Существующие изображения */}
                        {existingImages.length > 0 && (
                          <VStack gap="4" align="stretch">
                            <Text fontWeight="medium" fontSize="sm">
                              Текущие изображения ({existingImages.length}):
                            </Text>
                            {existingImages.map((image, index) => (
                              <Card.Root key={image.id} variant="outline" size="sm">
                                <Card.Body>
                                  <Grid templateColumns="auto 1fr auto" gap={4} alignItems="center">
                                    <Box
                                      position="relative"
                                      w="100px"
                                      h="80px"
                                      borderRadius="md"
                                      overflow="hidden"
                                      border={mainImageIndex === index ? '3px solid' : '1px solid'}
                                      borderColor={mainImageIndex === index ? 'blue.500' : 'gray.200'}
                                      cursor="pointer"
                                      onClick={() => handleSetMainFromExisting(index)}
                                    >
                                      <Image
                                        src={image.url}
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
                                          handleExistingImageAltChange(image.id, e.target.value)
                                        }
                                      />
                                      <Input
                                        placeholder="Подпись к фото"
                                        size="sm"
                                        value={image.caption}
                                        onChange={e =>
                                          handleExistingImageCaptionChange(image.id, e.target.value)
                                        }
                                      />
                                    </Stack>

                                    <HStack gap="1">
                                      <IconButton
                                        aria-label="Сделать обложкой"
                                        size="sm"
                                        variant={mainImageIndex === index ? 'solid' : 'ghost'}
                                        colorPalette={mainImageIndex === index ? 'blue' : 'gray'}
                                        onClick={() => handleSetMainFromExisting(index)}
                                        title="Сделать обложкой"
                                      >
                                        ⭐
                                      </IconButton>
                                      <IconButton
                                        aria-label="Переместить вверх"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleMoveExistingUp(index)}
                                        disabled={index === 0}
                                      >
                                        <FaArrowUp />
                                      </IconButton>
                                      <IconButton
                                        aria-label="Переместить вниз"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleMoveExistingDown(index)}
                                        disabled={index === existingImages.length - 1}
                                      >
                                        <FaArrowDown />
                                      </IconButton>
                                      <IconButton
                                        aria-label="Удалить"
                                        size="sm"
                                        colorPalette="red"
                                        variant="ghost"
                                        onClick={() => handleRemoveExistingImage(image)}
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

                        {/* Новые изображения */}
                        {newImages.length > 0 && (
                          <VStack gap="4" align="stretch">
                            <Text fontWeight="medium" fontSize="sm">
                              Новые изображения ({newImages.length}):
                            </Text>
                            {newImages.map((image, index) => (
                              <Card.Root key={image.id} variant="outline" size="sm">
                                <Card.Body>
                                  <Grid templateColumns="auto 1fr auto" gap={4} alignItems="center">
                                    <Box w="100px" h="80px" borderRadius="md" overflow="hidden">
                                      <Image
                                        src={image.preview}
                                        alt={image.alt || 'Превью'}
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                      />
                                    </Box>

                                    <Stack gap="2">
                                      <Input
                                        placeholder="Alt текст (для SEO)"
                                        size="sm"
                                        value={image.alt}
                                        onChange={e =>
                                          handleNewImageAltChange(index, e.target.value)
                                        }
                                      />
                                      <Input
                                        placeholder="Подпись к фото"
                                        size="sm"
                                        value={image.caption}
                                        onChange={e =>
                                          handleNewImageCaptionChange(index, e.target.value)
                                        }
                                      />
                                    </Stack>

                                    <HStack gap="1">
                                      <IconButton
                                        aria-label="Переместить вверх"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleMoveNewUp(index)}
                                        disabled={index === 0}
                                      >
                                        <FaArrowUp />
                                      </IconButton>
                                      <IconButton
                                        aria-label="Переместить вниз"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleMoveNewDown(index)}
                                        disabled={index === newImages.length - 1}
                                      >
                                        <FaArrowDown />
                                      </IconButton>
                                      <IconButton
                                        aria-label="Удалить"
                                        size="sm"
                                        colorPalette="red"
                                        variant="ghost"
                                        onClick={() => handleRemoveNewImage(index)}
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

                        {(existingImages.length === 0 && newImages.length === 0) && (
                          <Box
                            p={8}
                            borderWidth={1}
                            borderRadius="lg"
                            textAlign="center"
                            bg="gray.50"
                            _dark={{ bg: 'gray.800' }}
                          >
                            <Text color="gray.500">
                              Изображения не загружены. Загрузите фотографии для галереи новости.
                            </Text>
                          </Box>
                        )}
                      </Stack>
                    </Card.Body>
                  </Card.Root>

                  {/* Кнопки */}
                  <HStack justifyContent="flex-end" gap="3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/allnews')}
                      px={5}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      colorPalette="blue"
                      loading={isSubmitting}
                      px={5}
                    >
                      {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                  </HStack>
                </Stack>
              </form>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Container>
    </AuthGuard>
  );
}