// app/admin/news/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
  FileUpload,
  VStack,
  Text,
  useFileUpload,
  Spinner,
  Center,
  Alert,
} from '@chakra-ui/react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaTrash, FaPlus } from 'react-icons/fa';
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
  imageUrl: z.string().optional().or(z.literal('')),
  isPublished: z.boolean(),
  images: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().min(1, 'URL изображения обязателен'),
      alt: z.string().optional(),
      caption: z.string().optional(),
      order: z.number(),
    })
  ),
});

type NewsFormValues = z.infer<typeof NewsSchema>;

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileUpload = useFileUpload({
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024,
    accept: 'image/*',
  });

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
      imageUrl: '',
      isPublished: true,
      images: [],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  const acceptedFile = fileUpload.acceptedFiles[0];
  const previewUrl = acceptedFile ? URL.createObjectURL(acceptedFile) : null;

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
          imageUrl: news.imageUrl || '',
          isPublished: news.isPublished ?? true,
          images: news.images || [],
        });

        setCurrentImageUrl(news.imageUrl);
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

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    fileUpload.clearFiles();
    setUploadError(null);
  };

  const onSubmit = async (data: NewsFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      let imageUrl = currentImageUrl;

      // Если загружен новый файл
      if (acceptedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', acceptedFile);
        uploadFormData.append('entityType', 'news');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Ошибка загрузки изображения');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      const newsData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        imageUrl: imageUrl,
        isPublished: data.isPublished,
        images: data.images.map((img, index) => ({
          ...img,
          order: index,
        })),
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

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

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

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack gap="6">
                  <Stack direction={{ base: 'column', lg: 'row' }} gap="6">
                    {/* Левая колонка - основные поля */}
                    <Box flex="2">
                      <Stack gap="4">
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
                            <Field.ErrorText>
                              {errors.title.message}
                            </Field.ErrorText>
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
                            <Field.ErrorText>
                              {errors.excerpt.message}
                            </Field.ErrorText>
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
                            <Field.ErrorText>
                              {errors.content.message}
                            </Field.ErrorText>
                          )}
                        </Field.Root>

                        {/* Дополнительные изображения */}
                        <Box>
                          <HStack justify="space-between" mb={4}>
                            <Text fontWeight="medium">
                              Дополнительные изображения
                            </Text>
                            <Button
                              size="sm"
                              onClick={() =>
                                append({
                                  url: '',
                                  alt: '',
                                  caption: '',
                                  order: fields.length,
                                })
                              }
                              colorScheme="blue"
                              variant="outline"
                            >
                              Добавить
                            </Button>
                          </HStack>

                          {fields.length > 0 ? (
                            <VStack align="stretch">
                              {fields.map((field, index) => (
                                <Box
                                  key={field.id}
                                  p={4}
                                  border="1px solid"
                                  borderColor="gray.200"
                                  borderRadius="md"
                                >
                                  <HStack justify="space-between" mb={3}>
                                    <Text fontWeight="bold">
                                      Изображение {index + 1}
                                    </Text>
                                    <Button
                                      size="sm"
                                      colorScheme="red"
                                      variant="ghost"
                                      onClick={() => remove(index)}
                                    >
                                      <FaTrash />
                                    </Button>
                                  </HStack>

                                  <VStack>
                                    <Field.Root
                                      invalid={!!errors.images?.[index]?.url}
                                    >
                                      <Controller
                                        name={`images.${index}.url`}
                                        control={control}
                                        render={({ field }) => (
                                          <Input
                                            {...field}
                                            placeholder="URL изображения"
                                          />
                                        )}
                                      />
                                      {errors.images?.[index]?.url && (
                                        <Field.ErrorText>
                                          {errors.images[index]?.url?.message}
                                        </Field.ErrorText>
                                      )}
                                    </Field.Root>

                                    <Field.Root>
                                      <Controller
                                        name={`images.${index}.alt`}
                                        control={control}
                                        render={({ field }) => (
                                          <Input
                                            {...field}
                                            placeholder="Alt текст (опционально)"
                                          />
                                        )}
                                      />
                                    </Field.Root>

                                    <Field.Root>
                                      <Controller
                                        name={`images.${index}.caption`}
                                        control={control}
                                        render={({ field }) => (
                                          <Input
                                            {...field}
                                            placeholder="Подпись (опционально)"
                                          />
                                        )}
                                      />
                                    </Field.Root>
                                  </VStack>

                                  {field.url && (
                                    <Box mt={3}>
                                      <Image
                                        src={field.url}
                                        alt={field.alt || 'Preview'}
                                        maxH="100px"
                                        objectFit="cover"
                                        borderRadius="md"
                                      />
                                    </Box>
                                  )}
                                </Box>
                              ))}
                            </VStack>
                          ) : (
                            <Text color="gray.500" textAlign="center" py={4}>
                              Нет дополнительных изображений
                            </Text>
                          )}
                        </Box>
                      </Stack>
                    </Box>

                    {/* Правая колонка */}
                    <Box flex="1">
                      <Stack gap="4">
                        {/* Загрузка главного изображения */}
                        <Field.Root>
                          <Field.Label>Главное изображение</Field.Label>
                          <VStack gap="4" align="stretch">
                            {/* Текущее изображение */}
                            {currentImageUrl && !acceptedFile && (
                              <Box>
                                <Text fontSize="sm" fontWeight="medium" mb="2">
                                  Текущее изображение:
                                </Text>
                                <Image
                                  src={currentImageUrl}
                                  alt="Текущее изображение"
                                  borderRadius="md"
                                  maxH="200px"
                                  objectFit="cover"
                                  width="full"
                                />
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  colorPalette="red"
                                  mt={2}
                                  onClick={() => setCurrentImageUrl(null)}
                                >
                                  Удалить изображение
                                </Button>
                              </Box>
                            )}

                            <FileUpload.RootProvider value={fileUpload}>
                              <FileUpload.HiddenInput />

                              {!acceptedFile && !currentImageUrl ? (
                                <FileUpload.Dropzone>
                                  <FileUpload.DropzoneContent>
                                    <VStack gap="3" py="6">
                                      <Text textAlign="center">
                                        Перетащите сюда изображение
                                        <br />
                                        <Text
                                          as="span"
                                          fontSize="sm"
                                          color="gray.500"
                                        >
                                          или
                                        </Text>
                                      </Text>
                                      <FileUpload.Trigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          px={10}
                                        >
                                          Выберите файл
                                        </Button>
                                      </FileUpload.Trigger>
                                      <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        textAlign="center"
                                      >
                                        JPG, PNG, WebP до 5MB
                                      </Text>
                                    </VStack>
                                  </FileUpload.DropzoneContent>
                                </FileUpload.Dropzone>
                              ) : (
                                acceptedFile && (
                                  <FileUpload.ItemGroup>
                                    <FileUpload.Item file={acceptedFile}>
                                      <FileUpload.ItemPreview>
                                        {acceptedFile.type.startsWith(
                                          'image/'
                                        ) &&
                                          previewUrl && (
                                            <FileUpload.ItemPreviewImage
                                              src={previewUrl}
                                              alt="Предпросмотр"
                                            />
                                          )}
                                      </FileUpload.ItemPreview>
                                      <FileUpload.ItemContent>
                                        <FileUpload.ItemName />
                                        <FileUpload.ItemSizeText />
                                      </FileUpload.ItemContent>
                                      <FileUpload.ItemDeleteTrigger
                                        asChild
                                        onClick={handleRemoveFile}
                                      >
                                        <Button
                                          size="xs"
                                          variant="ghost"
                                          colorPalette="red"
                                        >
                                          ✕
                                        </Button>
                                      </FileUpload.ItemDeleteTrigger>
                                    </FileUpload.Item>
                                  </FileUpload.ItemGroup>
                                )
                              )}
                            </FileUpload.RootProvider>

                            {fileUpload.rejectedFiles.length > 0 && (
                              <Alert.Root status="error">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {fileUpload.rejectedFiles[0].errors
                                    .map(error =>
                                      error === 'TOO_LARGE'
                                        ? 'Файл слишком большой. Максимум 5MB'
                                        : error === 'INVALID_TYPE'
                                          ? 'Недопустимый тип файла'
                                          : 'Ошибка загрузки файла'
                                    )
                                    .join(', ')}
                                </Alert.Title>
                              </Alert.Root>
                            )}

                            {uploadError && (
                              <Alert.Root status="error">
                                <Alert.Indicator />
                                <Alert.Title>{uploadError}</Alert.Title>
                              </Alert.Root>
                            )}
                          </VStack>
                          <Field.HelperText>
                            Изображение будет отображаться в карточке новости
                          </Field.HelperText>
                        </Field.Root>

                        {/* Чекбокс публикации */}
                        <Field.Root>
                          <HStack justify="space-between" width="full">
                            <Field.Label>Опубликовано</Field.Label>
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
                                </Checkbox.Root>
                              )}
                            />
                          </HStack>
                          <Field.HelperText>
                            Если снять галочку, новость будет видна только
                            администраторам
                          </Field.HelperText>
                        </Field.Root>
                      </Stack>
                    </Box>
                  </Stack>

                  {/* Кнопки */}
                  <HStack justifyContent="flex-end" gap="3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/news')}
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
