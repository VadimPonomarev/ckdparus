'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Container,
  Heading,
  Text,
  Skeleton,
  Center,
  Button,
  Flex,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { FaHome, FaImages, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import GallerySlider from '@/components/gallery/galleryslider';

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
}

interface Gallery {
  id: string;
  title: string;
  description?: string;
  slug: string;
  coverImage?: string;
  images: GalleryImage[];
}

const GalleryPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/galleries/${id}`);

        if (!response.ok) {
          throw new Error('Ошибка загрузки галереи');
        }

        const data = await response.json();
        setGallery(data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [id]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Skeleton height="50px" mb={6} />
        <Skeleton height="600px" />
      </Container>
    );
  }

  if (error || !gallery) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center minH="400px" flexDirection="column" gap={4}>
          <Icon as={FaImages} boxSize={16} color="gray.400" />
          <Heading size="lg">Галерея не найдена</Heading>
          <Text color="gray.500">
            {error || 'Запрошенная галерея не существует'}
          </Text>
          <Button onClick={() => router.push('/gallery')} mt={4}>
            Вернуться к галереям
          </Button>
        </Center>
      </Container>
    );
  }

  return (
    <Box>
      {/* Заголовок */}
      <Container maxW="container.xl" py={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading as="h1" size="2xl" mb={2}>
              {gallery.title}
            </Heading>
            {gallery.description && (
              <Text color="fg.muted" fontSize="lg">
                {gallery.description}
              </Text>
            )}
            <Text fontSize="sm" color="fg.subtle" mt={2}>
              {gallery.images.length} фотографий
            </Text>
          </Box>

          <Button variant="outline" onClick={() => router.push('/gallery')}>
            К галереям
          </Button>
        </Flex>

        {/* Слайдер */}
        <GallerySlider images={gallery.images} />
      </Container>
    </Box>
  );
};

export default GalleryPage;
