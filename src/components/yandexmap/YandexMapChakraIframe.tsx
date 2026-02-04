// components/YandexMapChakraIframe.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  Spinner,
  Link,
  IconButton,
  Separator,
  Stack,
} from '@chakra-ui/react';

interface YandexMapChakraIframeProps {
  center?: [number, number];
  zoom?: number;
  width?: string;
  height?: string;
  address?: string;
}

const YandexMapChakraIframe = ({
  center = [55.080818, 21.89966],
  zoom = 17,
  width = '100%',
  height = '300px',
  address = 'ул. Победы, 34А, Советск, Калининградская область',
}: YandexMapChakraIframeProps) => {
  const [isClient, setIsClient] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [lat, lon] = center;
  const mapUrl = `https://yandex.ru/map-widget/v1/?ll=${lon},${lat}&z=${zoom}&l=map&pt=${lon},${lat},pm2rdl`;
  const yandexMapsUrl = `https://yandex.ru/maps/?pt=${lon},${lat}&z=${zoom}&l=map`;

  const reloadMap = () => {
    setIframeKey(prev => prev + 1);
  };

  if (!isClient) {
    return (
      <Stack
        width={width}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Text fontSize="2xl" fontWeight="bold">
          Мы на карте
        </Text>
        <Separator />
        <Spinner size="xl" color="blue.500" mb={4} />
        <Text color="gray.600">Загрузка карты...</Text>
        <Text fontSize="sm" color="gray.500" mt={2}>
          {address}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack width={width}>
      <Stack position="relative" height={height} overflow="hidden">
        <Text fontSize="2xl" fontWeight="bold">
          Мы на карте
        </Text>
        <Separator />
        <iframe
          key={iframeKey}
          src={mapUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          title={`Яндекс Карта: ${address}`}
          style={{ border: 'none' }}
          loading="lazy"
        />
      </Stack>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'stretch', md: 'center' }}
        gap={4}
        p={4}
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="gray.100"
      >
        <Box>
          <Flex align="center" mb={1}>
            <Box w="8px" h="8px" bg="red.500" borderRadius="full" mr={2} />
            <Text fontWeight="semibold">ул. Победы, 34А</Text>
          </Flex>
          <Text fontSize="sm" color="gray.600">
            г. Советск, Калининградская область
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Координаты: {lat.toFixed(6)}, {lon.toFixed(6)}
          </Text>
        </Box>

        <Flex gap={3}>
          {/* Способ 1: Использовать Link с asChild (если поддерживается) */}
          <Link
            href={yandexMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            _hover={{ textDecoration: 'none' }}
          >
            <Button colorScheme="blue" variant="outline" size="sm" px={10}>
              Открыть в Яндекс
            </Button>
          </Link>

          <IconButton
            aria-label="Обновить карту"
            onClick={reloadMap}
            variant="ghost"
            size="sm"
          />
        </Flex>
      </Flex>
    </Stack>
  );
};

export default YandexMapChakraIframe;
