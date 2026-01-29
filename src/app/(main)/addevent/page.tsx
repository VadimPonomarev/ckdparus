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
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

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

// Схема валидации
const EventSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Название слишком короткое')
    .max(100, 'Название слишком длинное')
    .required('Обязательное поле'),
  briefdescription: Yup.string()
    .min(10, 'Описание слишком короткое')
    .max(500, 'Описание слишком длинное')
    .required('Обязательное поле'),
  fulldescription: Yup.string()
    .min(20, 'Полное описание слишком короткое')
    .max(5000, 'Полное описание слишком длинное'),
  date: Yup.date()
    .min(new Date(), 'Дата должна быть в будущем')
    .required('Обязательное поле'),
  time: Yup.string().required('Обязательное поле'),
  location: Yup.string()
    .min(5, 'Место слишком короткое')
    .max(200, 'Место слишком длинное')
    .required('Обязательное поле'),
  price: Yup.number()
    .min(0, 'Цена не может быть отрицательной')
    .required('Обязательное поле'),
  category: Yup.string().required('Обязательное поле'),
  imageUrl: Yup.string().url('Введите корректный URL').nullable(),
});

// Типы для формы
interface EventFormValues {
  title: string;
  briefdescription: string;
  fulldescription: string;
  date: string;
  time: string;
  location: string;
  price: number;
  imageUrl: string;
  category: string;
  isFeatured: boolean;
  isActive: boolean;
}

// Интерфейс для Select
interface SelectValueChangeDetails {
  value: string[];
}

export default function AddEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: EventFormValues, { resetForm }: any) => {
    try {
      setIsSubmitting(true);

      const dateTime = new Date(
        `${values.date.split('T')[0]}T${values.time}:00`
      );

      const eventData = {
        title: values.title,
        briefdescription: values.briefdescription,
        fulldescription: values.fulldescription || null,
        date: dateTime.toISOString(),
        location: values.location,
        price: values.price,
        imageUrl: values.imageUrl || null,
        category: values.category,
        isFeatured: values.isFeatured,
        isActive: values.isActive,
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
      resetForm();
      router.push('/admin/events');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Ошибка при создании события. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialValues: EventFormValues = {
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
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Card.Root>
        <Card.Body>
          <Stack gap="6">
            <Heading size="xl">Добавить новое событие</Heading>

            <Formik
              initialValues={initialValues}
              validationSchema={EventSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, handleChange, errors, touched }) => (
                <Form>
                  <Fieldset.Root>
                    <Stack gap="6">
                      {/* Основная информация */}
                      <Stack direction={{ base: 'column', md: 'row' }} gap="6">
                        {/* Левая колонка */}
                        <Box flex="2">
                          <Fieldset.Content>
                            {/* Название */}
                            <Field.Root
                              invalid={!!(errors.title && touched.title)}
                            >
                              <Field.Label>Название события</Field.Label>
                              <Input
                                name="title"
                                placeholder="Введите название события"
                                value={values.title}
                                onChange={e =>
                                  setFieldValue('title', e.target.value)
                                }
                              />
                              {errors.title && touched.title && (
                                <Alert.Root status="error" mt="2">
                                  <Alert.Indicator />
                                  <Alert.Title>{errors.title}</Alert.Title>
                                </Alert.Root>
                              )}
                            </Field.Root>

                            {/* Краткое описание */}
                            <Field.Root
                              invalid={
                                !!(
                                  errors.briefdescription &&
                                  touched.briefdescription
                                )
                              }
                            >
                              <Field.Label>Краткое описание</Field.Label>
                              <Textarea
                                name="briefdescription"
                                placeholder="Краткое описание события (до 500 символов)"
                                rows={3}
                                value={values.briefdescription}
                                onChange={e =>
                                  setFieldValue('description', e.target.value)
                                }
                              />
                              {errors.briefdescription &&
                                touched.briefdescription && (
                                  <Alert.Root status="error" mt="2">
                                    <Alert.Indicator />
                                    <Alert.Title>
                                      {errors.briefdescription}
                                    </Alert.Title>
                                  </Alert.Root>
                                )}
                            </Field.Root>

                            {/* Полное описание */}
                            <Field.Root
                              invalid={
                                !!(
                                  errors.fulldescription &&
                                  touched.fulldescription
                                )
                              }
                            >
                              <Field.Label>
                                Полное описание (необязательно)
                              </Field.Label>
                              <Textarea
                                name="fulldescription"
                                placeholder="Подробное описание события (до 5000 символов)"
                                rows={4}
                                value={values.fulldescription}
                                onChange={e =>
                                  setFieldValue(
                                    'fulldescription',
                                    e.target.value
                                  )
                                }
                              />
                              {errors.fulldescription &&
                                touched.fulldescription && (
                                  <Alert.Root status="error" mt="2">
                                    <Alert.Indicator />
                                    <Alert.Title>
                                      {errors.fulldescription}
                                    </Alert.Title>
                                  </Alert.Root>
                                )}
                            </Field.Root>

                            {/* Дата и время */}
                            <HStack gap="4">
                              <Field.Root
                                flex="2"
                                invalid={!!(errors.date && touched.date)}
                              >
                                <Field.Label>Дата</Field.Label>
                                <Input
                                  name="date"
                                  type="date"
                                  min={new Date().toISOString().split('T')[0]}
                                  value={values.date}
                                  onChange={e =>
                                    setFieldValue('date', e.target.value)
                                  }
                                />
                                {errors.date && touched.date && (
                                  <Alert.Root status="error" mt="2">
                                    <Alert.Indicator />
                                    <Alert.Title>{errors.date}</Alert.Title>
                                  </Alert.Root>
                                )}
                              </Field.Root>

                              <Field.Root
                                flex="1"
                                invalid={!!(errors.time && touched.time)}
                              >
                                <Field.Label>Время</Field.Label>
                                <Input
                                  name="time"
                                  type="time"
                                  value={values.time}
                                  onChange={e =>
                                    setFieldValue('time', e.target.value)
                                  }
                                />
                                {errors.time && touched.time && (
                                  <Alert.Root status="error" mt="2">
                                    <Alert.Indicator />
                                    <Alert.Title>{errors.time}</Alert.Title>
                                  </Alert.Root>
                                )}
                              </Field.Root>
                            </HStack>

                            {/* Место проведения */}
                            <Field.Root
                              invalid={!!(errors.location && touched.location)}
                            >
                              <Field.Label>Место проведения</Field.Label>
                              <Input
                                name="location"
                                placeholder="Например: Большой концертный зал"
                                value={values.location}
                                onChange={e =>
                                  setFieldValue('location', e.target.value)
                                }
                              />
                              {errors.location && touched.location && (
                                <Alert.Root status="error" mt="2">
                                  <Alert.Indicator />
                                  <Alert.Title>{errors.location}</Alert.Title>
                                </Alert.Root>
                              )}
                            </Field.Root>
                          </Fieldset.Content>
                        </Box>

                        {/* Правая колонка */}
                        <Box flex="1">
                          <Fieldset.Content>
                            {/* Цена */}
                            <Field.Root
                              invalid={!!(errors.price && touched.price)}
                            >
                              <Field.Label>Цена (₽)</Field.Label>
                              <NumberInput.Root
                                value={values.price.toString()}
                                onChange={details => {
                                  // NumberInput передает details, а не строку
                                  if (
                                    details &&
                                    typeof details === 'object' &&
                                    'value' in details
                                  ) {
                                    const numValue =
                                      parseInt(details.value as string) || 0;
                                    setFieldValue('price', numValue);
                                  }
                                }}
                                min={0}
                                width="full"
                              >
                                <NumberInput.Control />
                                <NumberInput.Input />
                              </NumberInput.Root>
                              {errors.price && touched.price && (
                                <Alert.Root status="error" mt="2">
                                  <Alert.Indicator />
                                  <Alert.Title>{errors.price}</Alert.Title>
                                </Alert.Root>
                              )}
                            </Field.Root>

                            {/* Категория */}
                            <Field.Root
                              invalid={!!(errors.category && touched.category)}
                            >
                              <Field.Label>Категория</Field.Label>
                              <Select.Root
                                collection={categoriesCollection}
                                value={[values.category]}
                                onValueChange={(
                                  details: SelectValueChangeDetails
                                ) =>
                                  setFieldValue(
                                    'category',
                                    details.value[0] || ''
                                  )
                                }
                                width="full"
                              >
                                <Select.HiddenSelect name="category" />
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
                              {errors.category && touched.category && (
                                <Alert.Root status="error" mt="2">
                                  <Alert.Indicator />
                                  <Alert.Title>{errors.category}</Alert.Title>
                                </Alert.Root>
                              )}
                            </Field.Root>

                            {/* URL изображения */}
                            <Field.Root
                              invalid={!!(errors.imageUrl && touched.imageUrl)}
                            >
                              <Field.Label>
                                URL изображения (необязательно)
                              </Field.Label>
                              <Input
                                name="imageUrl"
                                placeholder="https://example.com/image.jpg"
                                type="url"
                                value={values.imageUrl}
                                onChange={e =>
                                  setFieldValue('imageUrl', e.target.value)
                                }
                              />
                              {errors.imageUrl && touched.imageUrl && (
                                <Alert.Root status="error" mt="2">
                                  <Alert.Indicator />
                                  <Alert.Title>{errors.imageUrl}</Alert.Title>
                                </Alert.Root>
                              )}
                            </Field.Root>

                            {/* Чекбоксы */}
                            <Stack gap="4">
                              <Checkbox.Root
                                checked={values.isFeatured}
                                onCheckedChange={checked => {
                                  // checked может быть boolean или "indeterminate"
                                  if (typeof checked === 'boolean') {
                                    setFieldValue('isFeatured', checked);
                                  }
                                }}
                              >
                                <Checkbox.HiddenInput name="isFeatured" />
                                <Checkbox.Control />
                                <Checkbox.Label>
                                  Избранное событие
                                </Checkbox.Label>
                              </Checkbox.Root>
                              <Box fontSize="sm" color="gray.500" ml="7">
                                Показывать на главной странице
                              </Box>

                              <Checkbox.Root
                                checked={values.isActive}
                                onCheckedChange={checked => {
                                  // checked может быть boolean или "indeterminate"
                                  if (typeof checked === 'boolean') {
                                    setFieldValue('isActive', checked);
                                  }
                                }}
                              >
                                <Checkbox.HiddenInput name="isActive" />
                                <Checkbox.Control />
                                <Checkbox.Label>
                                  Активное событие
                                </Checkbox.Label>
                              </Checkbox.Root>
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
                                {values.date && values.time ? (
                                  <Box>
                                    {new Date(
                                      `${values.date}T${values.time}`
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
                        >
                          Отмена
                        </Button>
                        <Button
                          type="submit"
                          colorPalette="blue"
                          loading={isSubmitting}
                        >
                          {isSubmitting ? 'Создание...' : 'Создать событие'}
                        </Button>
                      </Card.Footer>
                    </Stack>
                  </Fieldset.Root>
                </Form>
              )}
            </Formik>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}
