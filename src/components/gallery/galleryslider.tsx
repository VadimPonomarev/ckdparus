'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  Image,
  Flex,
  Text,
  Container,
  Icon,
  Button,
  Portal,
  Center,
} from '@chakra-ui/react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaCompress,
  FaDownload,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
}

interface GallerySliderProps {
  images: GalleryImage[];
}

const GallerySlider: React.FC<GallerySliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Обработчики клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        if (isFullscreen) handleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFullscreen]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsZoomed(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex].url;
    link.download = `image-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) {
    return (
      <Center minH="400px">
        <Text color="gray.500">Нет изображений</Text>
      </Center>
    );
  }

  const renderContent = () => (
    <>
      {/* Основной слайдер */}
      <Box
        position="relative"
        h={isFullscreen ? '100vh' : '70vh'}
        w="100%"
        bg="black"
        overflow="hidden"
      >
        {/* Изображение */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor={isZoomed ? 'zoom-out' : 'zoom-in'}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src={images[currentIndex].url}
                alt={
                  images[currentIndex].alt || `Изображение ${currentIndex + 1}`
                }
                maxW={isZoomed ? 'none' : '100%'}
                maxH={isZoomed ? 'none' : '100%'}
                w={isZoomed ? 'auto' : '100%'}
                h={isZoomed ? 'auto' : '100%'}
                objectFit={isZoomed ? 'contain' : 'contain'}
                loading="lazy"
                draggable={false}
                userSelect="none"
              />
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Навигационные кнопки */}
        <IconButton
          aria-label="Предыдущее фото"
          position="absolute"
          left={4}
          top="50%"
          transform="translateY(-50%)"
          onClick={handlePrev}
          bg="blackAlpha.600"
          _hover={{ bg: 'blackAlpha.800' }}
          color="white"
          size="lg"
          zIndex={10}
        >
          <Icon as={FaChevronLeft} />
        </IconButton>

        <IconButton
          aria-label="Следующее фото"
          position="absolute"
          right={4}
          top="50%"
          transform="translateY(-50%)"
          onClick={handleNext}
          bg="blackAlpha.600"
          _hover={{ bg: 'blackAlpha.800' }}
          color="white"
          size="lg"
          zIndex={10}
        >
          <Icon as={FaChevronRight} />
        </IconButton>

        {/* Верхние кнопки управления */}
        <Flex position="absolute" top={4} right={4} gap={2} zIndex={10}>
          <IconButton
            aria-label="Скачать"
            onClick={handleDownload}
            bg="blackAlpha.600"
            _hover={{ bg: 'blackAlpha.800' }}
            color="white"
          >
            <Icon as={FaDownload} />
          </IconButton>

          <IconButton
            aria-label={
              isFullscreen
                ? 'Выйти из полноэкранного режима'
                : 'Полноэкранный режим'
            }
            onClick={handleFullscreen}
            bg="blackAlpha.600"
            _hover={{ bg: 'blackAlpha.800' }}
            color="white"
          >
            <Icon as={isFullscreen ? FaCompress : FaExpand} />
          </IconButton>
        </Flex>

        {/* Информация о фото */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
          color="white"
          p={6}
          pt={12}
        >
          <Container maxW="container.xl">
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Text fontSize="lg" fontWeight="medium">
                  {images[currentIndex].alt ||
                    `Изображение ${currentIndex + 1}`}
                </Text>
                {images[currentIndex].caption && (
                  <Text fontSize="sm" opacity={0.8} mt={1}>
                    {images[currentIndex].caption}
                  </Text>
                )}
              </Box>

              <Text fontSize="sm" opacity={0.8}>
                {currentIndex + 1} / {images.length}
              </Text>
            </Flex>
          </Container>
        </Box>
      </Box>

      {/* Миниатюры */}
      {images.length > 1 && !isFullscreen && (
        <Box mt={4} p={4}>
          <Flex gap={2} overflowX="auto" py={2}>
            {images.map((image, index) => (
              <Box
                key={image.id}
                flexShrink={0}
                w="100px"
                h="80px"
                borderRadius="md"
                overflow="hidden"
                cursor="pointer"
                opacity={index === currentIndex ? 1 : 0.6}
                border={index === currentIndex ? '3px solid' : '1px solid'}
                borderColor={
                  index === currentIndex ? 'blue.500' : 'transparent'
                }
                _hover={{ opacity: 1 }}
                onClick={() => setCurrentIndex(index)}
                transition="all 0.2s ease"
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Миниатюра ${index + 1}`}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              </Box>
            ))}
          </Flex>
        </Box>
      )}
    </>
  );

  if (isFullscreen) {
    return (
      <Portal>
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="black"
          zIndex={9999}
        >
          {renderContent()}
        </Box>
      </Portal>
    );
  }

  return <Box position="relative">{renderContent()}</Box>;
};

export default GallerySlider;
