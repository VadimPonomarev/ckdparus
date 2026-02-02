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
  Checkbox,
  Stack,
  Heading,
  Alert,
  Card,
  Portal,
  createListCollection,
  For,
  Select,
  Text,
} from '@chakra-ui/react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dynamic from 'next/dynamic';

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
  imageUrl: z
    .string()
    .url('Введите корректный URL')
    .optional()
    .or(z.literal('')),
  isPublished: z.boolean(),
});

// Типы для формы
type NewsFormValues = z.infer<typeof NewsSchema>;

export default function AddNewsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      imageUrl: '',
      isPublished: true,
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<NewsFormValues> = async data => {
    try {
      setIsSubmitting(true);

      const newsData = {
        title: data.title,
        excerpt: data.excerpt || null,
        content: data.content,
        imageUrl: data.imageUrl || null,
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
        throw new Error('Ошибка при сохранении новости');
      }

      alert('Новость успешно создана!');
      reset();
      router.push('/');
    } catch (error) {
      console.error('Error creating news:', error);
      alert('Ошибка при создании новости. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Card.Root>
        <Card.Body p={10}>
          <Stack gap="6">
            <Heading size="xl">Добавить новую новость</Heading>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Fieldset.Root>
                <Stack gap="6">
                  {/* Основная информация */}
                  <Stack direction={{ base: 'column', md: 'row' }} gap="6">
                    {/* Левая колонка */}
                    <Box flex="2">
                      <Fieldset.Content>
                        {/* Заголовок */}
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
                              <Alert.Title>{errors.title.message}</Alert.Title>
                            </Alert.Root>
                          )}
                        </Field.Root>

                        {/* Краткое описание */}
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

                        {/* Полное содержание */}
                        <Field.Root invalid={!!errors.content}>
                          <Field.Label>Содержание новости</Field.Label>
                          <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder="Полное содержание новости"
                                rows={8}
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
                      </Fieldset.Content>
                    </Box>

                    {/* Правая колонка */}
                    <Box flex="1">
                      <Fieldset.Content>
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
                          <Field.HelperText>
                            Рекомендуемый размер: 1200×630px
                          </Field.HelperText>
                        </Field.Root>

                        {/* Статус публикации */}
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
                              mt={6}
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control cursor="pointer" />
                              <Checkbox.Label fontSize="lg">
                                Опубликовать сразу
                              </Checkbox.Label>
                            </Checkbox.Root>
                          )}
                        />
                        <Box fontSize="sm" color="gray.500" ml="7">
                          Если снять галочку, новость сохранится как черновик
                        </Box>

                        {/* Предпросмотр */}
                        <Card.Root variant="outline" mt={8}>
                          <Card.Body>
                            <Heading size="sm" mb="3">
                              Предпросмотр
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                              Новость будет отображаться в разделе "Новости"
                            </Text>
                            <Box mt={2}>
                              <Text fontSize="xs">
                                • Автоматически добавится дата публикации
                              </Text>
                              <Text fontSize="xs">
                                • Счетчик просмотров начнется с 0
                              </Text>
                            </Box>
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
                    >
                      {isSubmitting ? 'Создание...' : 'Создать новость'}
                    </Button>
                  </Card.Footer>
                </Stack>
              </Fieldset.Root>
            </form>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}
