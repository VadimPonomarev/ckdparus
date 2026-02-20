// app/admin/events/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Fieldset,
  Input,
  Textarea,
  NumberInput,
  Checkbox,
  Stack,
  Heading,
  Alert,
  HStack,
  Select,
  Portal,
  createListCollection,
  For,
  Image,
  FileUpload,
  VStack,
  Text,
  useFileUpload,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HiUpload, HiX } from 'react-icons/hi';
import AuthGuard from '@/components/auth/AuthGuard';

const categoriesCollection = createListCollection({
  items: [
    { label: 'Концерт', value: 'концерт' },
    { label: 'Выставка', value: 'выставка' },
    { label: 'Спектакль', value: 'спектакль' },
    { label: 'Фестиваль', value: 'фестиваль' },
    { label: 'Мастер-класс', value: 'мастер-класс' },
    { label: 'Лекция', value: 'лекция' },
    { label: 'Конкурс', value: 'конкурс' },
    { label: 'Другое', value: 'другое' },
  ],
});

const EventSchema = z.object({
  title: z
    .string()
    .min(5, 'Название слишком короткое')
    .max(100, 'Название слишком длинное')
    .nonempty('Обязательное поле'),
  briefdescription: z
    .string()
    .min(10, 'Описание слишком короткое')
    .max(500, 'Описание слишком длинное')
    .nonempty('Обязательное поле'),
  fulldescription: z
    .string()
    .min(20, 'Полное описание слишком короткое')
    .max(5000, 'Полное описание слишком длинное')
    .optional()
    .or(z.literal('')),
  date: z.string().nonempty('Обязательное поле'),
  time: z.string().nonempty('Обязательное поле'),
  location: z
    .string()
    .min(5, 'Место слишком короткое')
    .max(200, 'Место слишком длинное')
    .nonempty('Обязательное поле'),
  price: z
    .number({ error: 'Цена должна быть числом' })
    .min(0, 'Цена не может быть отрицательной'),
  category: z.string().nonempty('Обязательное поле'),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

type EventFormValues = z.infer<typeof EventSchema>;

export default function EditEventPage() {
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
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: '',
      briefdescription: '',
      fulldescription: '',
      date: '',
      time: '19:00',
      location: '',
      price: 0,
      category: '',
      isFeatured: false,
      isActive: true,
    },
    mode: 'onBlur',
  });

  const watchDate = watch('date');
  const watchTime = watch('time');

  const acceptedFile = fileUpload.acceptedFiles[0];
  const previewUrl = acceptedFile ? URL.createObjectURL(acceptedFile) : null;

  // Загрузка данных события
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/events/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Событие не найдено');
          }
          throw new Error('Ошибка загрузки события');
        }

        const event = await response.json();

        // Форматируем дату для полей формы
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toISOString().split('T')[0];
        const formattedTime = eventDate.toTimeString().slice(0, 5);

        reset({
          title: event.title,
          briefdescription: event.briefdescription,
          fulldescription: event.fulldescription || '',
          date: formattedDate,
          time: formattedTime,
          location: event.location,
          price: event.price,
          category: event.category || '',
          isFeatured: event.isFeatured,
          isActive: event.isActive,
        });

        setCurrentImageUrl(event.imageUrl);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, reset]);

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    fileUpload.clearFiles();
    setUploadError(null);
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const dateTime = new Date(`${data.date}T${data.time}:00`);
      let imageUrl = currentImageUrl;

      // Если загружен новый файл
      if (acceptedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', acceptedFile);
        uploadFormData.append('entityType', 'events');

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

      const eventData = {
        title: data.title,
        briefdescription: data.briefdescription,
        fulldescription: data.fulldescription || null,
        date: dateTime.toISOString(),
        location: data.location,
        price: data.price,
        imageUrl: imageUrl,
        category: data.category,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
      };

      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при обновлении события');
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      alert('Событие успешно обновлено!');
      router.push('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Ошибка при обновлении события. Попробуйте еще раз.'
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
              <Text>Загрузка данных события...</Text>
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
          <Text>{error}</Text>

          <Center mt={4}>
            <Button onClick={() => router.push('/admin/events')}>
              Вернуться к списку
            </Button>
          </Center>
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
              <Heading size="xl">Редактировать событие</Heading>

              {error && <Text>{error}</Text>}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Fieldset.Root>
                  <Stack gap="6">
                    <Stack direction={{ base: 'column', lg: 'row' }} gap="6">
                      {/* Левая колонка - те же поля что и в AddEventPage */}
                      <Box flex="2">
                        <Fieldset.Content>
                          {/* Все поля формы такие же как в AddEventPage */}
                          <Field.Root invalid={!!errors.title}>
                            <Field.Label>Название события</Field.Label>
                            <Controller
                              name="title"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Введите название события"
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

                          <Field.Root invalid={!!errors.briefdescription}>
                            <Field.Label>Краткое описание</Field.Label>
                            <Controller
                              name="briefdescription"
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  {...field}
                                  placeholder="Краткое описание события (до 500 символов)"
                                  rows={3}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            {errors.briefdescription && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.briefdescription.message}
                                </Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>

                          <Field.Root invalid={!!errors.fulldescription}>
                            <Field.Label>Полное описание</Field.Label>
                            <Controller
                              name="fulldescription"
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  {...field}
                                  placeholder="Подробное описание события (до 5000 символов)"
                                  rows={4}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            {errors.fulldescription && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.fulldescription.message}
                                </Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>

                          <HStack gap="4">
                            <Field.Root flex="2" invalid={!!errors.date}>
                              <Field.Label>Дата</Field.Label>
                              <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="date"
                                    onBlur={field.onBlur}
                                  />
                                )}
                              />
                              {errors.date && (
                                <Alert.Root status="error" mt="2">
                                  <Alert.Indicator />
                                  <Alert.Title>
                                    {errors.date.message}
                                  </Alert.Title>
                                </Alert.Root>
                              )}
                            </Field.Root>

                            <Field.Root flex="1" invalid={!!errors.time}>
                              <Field.Label>Время</Field.Label>
                              <Controller
                                name="time"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="time"
                                    onBlur={field.onBlur}
                                  />
                                )}
                              />
                              {errors.time && (
                                <Alert.Root status="error" mt="2">
                                  <Alert.Indicator />
                                  <Alert.Title>
                                    {errors.time.message}
                                  </Alert.Title>
                                </Alert.Root>
                              )}
                            </Field.Root>
                          </HStack>

                          <Field.Root invalid={!!errors.location}>
                            <Field.Label>Место проведения</Field.Label>
                            <Controller
                              name="location"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Например: Большой концертный зал"
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            {errors.location && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.location.message}
                                </Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>
                        </Fieldset.Content>
                      </Box>

                      {/* Правая колонка */}
                      <Box flex="1">
                        <Fieldset.Content>
                          {/* Загрузка изображения */}
                          <Field.Root>
                            <Field.Label>Изображение события</Field.Label>
                            <VStack gap="4" align="stretch">
                              {/* Текущее изображение */}
                              {currentImageUrl && !acceptedFile && (
                                <Box>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    mb="2"
                                  >
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
                                    <HiX />
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
                                            <HiUpload />
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
                                          <FileUpload.ItemDeleteTrigger
                                            asChild
                                            onClick={handleRemoveFile}
                                          >
                                            <Button
                                              size="xs"
                                              variant="ghost"
                                              colorPalette="red"
                                            >
                                              <HiX />
                                            </Button>
                                          </FileUpload.ItemDeleteTrigger>
                                        </FileUpload.ItemContent>
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
                              Изображение будет отображаться на карточке события
                            </Field.HelperText>
                          </Field.Root>

                          {/* Цена */}
                          <Field.Root invalid={!!errors.price}>
                            <Field.Label>Цена (₽)</Field.Label>
                            <Controller
                              name="price"
                              control={control}
                              render={({ field }) => (
                                <NumberInput.Root
                                  value={field.value.toString()}
                                  onValueChange={details => {
                                    const numValue =
                                      parseInt(details.value as string) || 0;
                                    field.onChange(numValue);
                                  }}
                                  min={0}
                                  width="full"
                                >
                                  <NumberInput.Control />
                                  <NumberInput.Input />
                                </NumberInput.Root>
                              )}
                            />
                            {errors.price && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.price.message}
                                </Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>

                          {/* Категория */}
                          <Field.Root invalid={!!errors.category}>
                            <Field.Label>Категория</Field.Label>
                            <Controller
                              name="category"
                              control={control}
                              render={({ field }) => (
                                <Select.Root
                                  collection={categoriesCollection}
                                  value={[field.value]}
                                  onValueChange={details =>
                                    field.onChange(details.value[0] || '')
                                  }
                                  width="full"
                                >
                                  <Select.HiddenSelect />
                                  <Select.Control>
                                    <Select.Trigger>
                                      <Select.ValueText placeholder="Выберите категорию" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                      <Select.Indicator />
                                    </Select.IndicatorGroup>
                                  </Select.Control>
                                  <Portal>
                                    <Select.Positioner>
                                      <Select.Content>
                                        <For each={categoriesCollection.items}>
                                          {category => (
                                            <Select.Item
                                              item={category}
                                              key={category.value}
                                            >
                                              {category.label}
                                              <Select.ItemIndicator />
                                            </Select.Item>
                                          )}
                                        </For>
                                      </Select.Content>
                                    </Select.Positioner>
                                  </Portal>
                                </Select.Root>
                              )}
                            />
                            {errors.category && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.category.message}
                                </Alert.Title>
                              </Alert.Root>
                            )}
                          </Field.Root>

                          {/* Чекбоксы */}
                          <Stack gap="4">
                            <Controller
                              name="isFeatured"
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
                                    Избранное событие
                                  </Checkbox.Label>
                                </Checkbox.Root>
                              )}
                            />
                            <Box fontSize="sm" color="gray.500" ml="7">
                              Показывать на главной странице
                            </Box>

                            <Controller
                              name="isActive"
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
                                    Активное событие
                                  </Checkbox.Label>
                                </Checkbox.Root>
                              )}
                            />
                            <Box fontSize="sm" color="gray.500" ml="7">
                              Показывать на сайте
                            </Box>
                          </Stack>

                          {/* Предпросмотр даты */}
                          <Card.Root variant="outline" mt="4">
                            <Card.Body>
                              <Heading size="sm" mb="3">
                                Предпросмотр даты
                              </Heading>
                              {watchDate && watchTime ? (
                                <Box>
                                  {new Date(
                                    `${watchDate}T${watchTime}`
                                  ).toLocaleString('ru-RU', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </Box>
                              ) : (
                                <Box color="gray.500">
                                  Укажите дату и время для предпросмотра
                                </Box>
                              )}
                            </Card.Body>
                          </Card.Root>
                        </Fieldset.Content>
                      </Box>
                    </Stack>

                    {/* Кнопки */}
                    <Card.Footer justifyContent="flex-end" gap="3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/events')}
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
