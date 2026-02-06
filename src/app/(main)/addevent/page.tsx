'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
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
  Card,
  Select,
  Portal,
  createListCollection,
  For,
} from '@chakra-ui/react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AuthGuard from '@/components/auth/AuthGuard';

// Создаем коллекцию категорий
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

// Схема валидации с использованием Zod - БЕЗ .default() для boolean полей
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
  date: z
    .string()
    .nonempty('Обязательное поле')
    .refine(
      date => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
      'Дата должна быть в будущем'
    ),
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
  imageUrl: z
    .string()
    .url('Введите корректный URL')
    .optional()
    .or(z.literal('')),
  isFeatured: z.boolean(), // Убрали .default(false)
  isActive: z.boolean(), // Убрали .default(true)
});

// Типы для формы
type EventFormValues = z.infer<typeof EventSchema>;

export default function AddEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
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
      imageUrl: '',
      category: '',
      isFeatured: false,
      isActive: true,
    },
    mode: 'onBlur',
  });

  // Для предпросмотра даты
  const watchDate = watch('date');
  const watchTime = watch('time');

  const onSubmit: SubmitHandler<EventFormValues> = async data => {
    try {
      setIsSubmitting(true);

      const dateTime = new Date(`${data.date}T${data.time}:00`);

      const eventData = {
        title: data.title,
        briefdescription: data.briefdescription,
        fulldescription: data.fulldescription || null,
        date: dateTime.toISOString(),
        location: data.location,
        price: data.price,
        imageUrl: data.imageUrl || null,
        category: data.category,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при сохранении события');
      }

      alert('Событие успешно создано!');
      reset();
      router.push('/');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Ошибка при создании события. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <Box>
        <Card.Root>
          <Card.Body p={10}>
            <Stack gap="6">
              <Heading size="xl">Добавить новое событие</Heading>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Fieldset.Root>
                  <Stack gap="6">
                    {/* Основная информация */}
                    <Stack direction={{ base: 'column', md: 'row' }} gap="6">
                      {/* Левая колонка */}
                      <Box flex="2">
                        <Fieldset.Content>
                          {/* Название */}
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

                          {/* Краткое описание */}
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

                          {/* Полное описание */}
                          <Field.Root invalid={!!errors.fulldescription}>
                            <Field.Label>
                              Полное описание (необязательно)
                            </Field.Label>
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

                          {/* Дата и время */}
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
                                    min={new Date().toISOString().split('T')[0]}
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

                          {/* Место проведения */}
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

                          {/* URL изображения */}
                          <Field.Root invalid={!!errors.imageUrl}>
                            <Field.Label>
                              URL изображения (необязательно)
                            </Field.Label>
                            <Controller
                              name="imageUrl"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="https://example.com/image.jpg"
                                  type="url"
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            {errors.imageUrl && (
                              <Alert.Root status="error" mt="2">
                                <Alert.Indicator />
                                <Alert.Title>
                                  {errors.imageUrl.message}
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
                        {isSubmitting ? 'Создание...' : 'Создать событие'}
                      </Button>
                    </Card.Footer>
                  </Stack>
                </Fieldset.Root>
              </form>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Box>
    </AuthGuard>
  );
}
