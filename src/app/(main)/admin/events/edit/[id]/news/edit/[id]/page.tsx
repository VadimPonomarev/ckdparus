// app/admin/news/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Spinner,
  Center,
  Text,
  HStack,
  IconButton,
  Image,
  Switch,
  Field,
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface NewsImage {
  id?: string;
  url: string;
  alt?: string;
  caption?: string;
  order: number;
}

const EditNewsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    isPublished: true,
    images: [] as NewsImage[],
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/${id}`);

        if (!response.ok) {
          throw new Error('Не удалось загрузить новость');
        }

        const data = await response.json();

        setFormData({
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          imageUrl: data.imageUrl || '',
          isPublished: data.isPublished ?? true,
          images: data.images || [],
        });
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');

        toaster.create({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные новости',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchNews();
    }
  }, [id, isAuthenticated]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isPublished: checked }));
  };

  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [
        ...prev.images,
        { url: '', alt: '', caption: '', order: prev.images.length },
      ],
    }));
  };

  const handleImageChange = (
    index: number,
    field: keyof NewsImage,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      ),
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toaster.create({
        title: 'Ошибка',
        description: 'Заголовок обязателен',
        type: 'error',
      });
      return;
    }

    if (!formData.content.trim()) {
      toaster.create({
        title: 'Ошибка',
        description: 'Содержание обязательно',
        type: 'error',
      });
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/news/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при сохранении');
      }

      toaster.create({
        title: 'Успех',
        description: 'Новость успешно обновлена',
        type: 'success',
      });

      router.push(`/news/${id}`);
    } catch (err) {
      console.error('Error saving news:', err);
      toaster.create({
        title: 'Ошибка',
        description:
          err instanceof Error ? err.message : 'Не удалось сохранить новость',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Center minH="60vh">
        <Text>Доступ запрещен. Требуется авторизация.</Text>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="60vh">
        <VStack>
          <Heading size="md" color="red.500">
            {error}
          </Heading>
          <Button onClick={() => router.push('/admin/news')}>
            Вернуться к списку
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Container maxW="800px" py={8}>
      <Heading mb={6}>Редактирование новости</Heading>

      <form onSubmit={handleSubmit}>
        <VStack align="stretch">
          <FormControl isRequired>
            <FormLabel>Заголовок</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введите заголовок новости"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Краткое описание</FormLabel>
            <Textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Краткое описание (до 300 символов)"
              maxLength={300}
              rows={3}
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              {formData.excerpt.length}/300
            </Text>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Содержание</FormLabel>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Полный текст новости"
              rows={10}
            />
          </FormControl>

          <FormControl>
            <FormLabel>URL главного изображения</FormLabel>
            <Input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </FormControl>

          <Field.Root>
            <HStack justify="space-between" width="full">
              <Field.Label>Опубликовано</Field.Label>
              <Switch.Root
                checked={formData.isPublished}
                onCheckedChange={e => handleSwitchChange(e.checked)}
                colorScheme="blue"
              >
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>
                  {formData.isPublished ? 'Да' : 'Нет'}
                </Switch.Label>
              </Switch.Root>
            </HStack>
          </Field.Root>

          {/* Дополнительные изображения */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <FormLabel mb={0}>Дополнительные изображения</FormLabel>
              <Button
                size="sm"
                onClick={handleAddImage}
                colorScheme="blue"
                variant="outline"
              >
                Добавить
              </Button>
            </HStack>

            {formData.images.length > 0 ? (
              <VStack align="stretch">
                {formData.images.map((img, index) => (
                  <Box
                    key={index}
                    p={4}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                  >
                    <HStack justify="space-between" mb={3}>
                      <Text fontWeight="bold">Изображение {index + 1}</Text>
                      <IconButton
                        aria-label="Удалить"
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveImage(index)}
                      />
                    </HStack>

                    <VStack>
                      <Input
                        placeholder="URL изображения"
                        value={img.url}
                        onChange={e =>
                          handleImageChange(index, 'url', e.target.value)
                        }
                      />
                      <Input
                        placeholder="Alt текст (опционально)"
                        value={img.alt || ''}
                        onChange={e =>
                          handleImageChange(index, 'alt', e.target.value)
                        }
                      />
                      <Input
                        placeholder="Подпись (опционально)"
                        value={img.caption || ''}
                        onChange={e =>
                          handleImageChange(index, 'caption', e.target.value)
                        }
                      />
                    </VStack>

                    {img.url && (
                      <Box mt={3}>
                        <Image
                          src={img.url}
                          alt={img.alt || 'Preview'}
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

          <HStack justify="flex-end" pt={4}>
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              loadingText="Сохранение..."
            >
              Сохранить
            </Button>
          </HStack>
        </VStack>
      </form>
    </Container>
  );
};

export default EditNewsPage;
