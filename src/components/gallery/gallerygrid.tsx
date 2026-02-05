'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Heading,
  Text,
  Image,
  Skeleton,
  Center,
  Flex,
  Badge,
  Separator,
  Stack,
} from '@chakra-ui/react';
import { FaImages, FaArrowRight } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';

interface Gallery {
  id: string;
  title: string;
  description?: string;
  slug: string;
  coverImage?: string;
  images: GalleryImage[];
}

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
}

const GalleryGrid = () => {
  const router = useRouter();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/galleries');

        if (!response.ok) {
          throw new Error('Ошибка загрузки галерей');
        }

        const data = await response.json();
        setGalleries(data);
      } catch (err) {
        console.error('Error fetching galleries:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const handleGalleryClick = (gallery: Gallery) => {
    router.push(`/gallery/${gallery.id}`);
  };

  if (loading) {
    return (
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
        gap={6}
        p={4}
      >
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} height="300px" borderRadius="lg" />
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Center minH="400px">
        <Text color="red.500">Ошибка: {error}</Text>
      </Center>
    );
  }

  if (galleries.length === 0) {
    return (
      <Center minH="400px" flexDirection="column" gap={4}>
        <Icon as={FaImages} boxSize={16} color="gray.400" />
        <Text fontSize="lg" color="gray.500">
          Галереи пока не добавлены
        </Text>
      </Center>
    );
  }

  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        Фотогалерея
      </Text>
      <Separator />

      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
        gap={6}
      >
        {galleries.map(gallery => {
          const coverImage =
            gallery.coverImage ||
            gallery.images[0]?.url ||
            '/images/placeholder.jpg';
          const imageCount = gallery.images.length;

          return (
            <Box
              key={gallery.id}
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              cursor="pointer"
              onClick={() => handleGalleryClick(gallery)}
              _hover={{
                transform: 'translateY(-8px)',
                boxShadow: '2xl',
                '& .overlay': {
                  opacity: 1,
                },
                '& .image': {
                  transform: 'scale(1.05)',
                },
              }}
              transition="all 0.3s ease"
              boxShadow="lg"
            >
              {/* Контейнер изображения */}
              <Box position="relative" overflow="hidden">
                <Image
                  src={coverImage}
                  alt={gallery.title}
                  className="image"
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  transition="transform 0.3s ease"
                />

                {/* Наложение */}
                <Box
                  className="overlay"
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)"
                  opacity={0.7}
                  transition="opacity 0.3s ease"
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  p={6}
                >
                  {/* Бейдж с количеством фото */}
                  <Badge
                    position="absolute"
                    top={4}
                    right={4}
                    colorPalette="white"
                    bg="blackAlpha.600"
                    backdropFilter="blur(4px)"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    {imageCount} фото
                  </Badge>

                  {/* Контент */}
                  <Box color="white" pb={20}>
                    <Heading as="h3" size="md" mb={2}>
                      {gallery.title}
                    </Heading>
                    {gallery.description && (
                      <Text fontSize="sm" opacity={0.9}>
                        {gallery.description}
                      </Text>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Кнопка просмотра */}
              <Flex
                position="absolute"
                bottom={4}
                left={4}
                alignItems="center"
                gap={2}
                color="white"
                fontSize="sm"
                fontWeight="medium"
                opacity={0.9}
              >
                <Text>Смотреть</Text>
                <Icon as={FaArrowRight} />
              </Flex>
            </Box>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default GalleryGrid;
