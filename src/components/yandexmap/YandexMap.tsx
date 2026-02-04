// components/YandexMap.jsx
'use client';

import { Box, Separator, Stack, Text } from '@chakra-ui/react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { useState, useEffect } from 'react';

interface YandexMapProps {
  center?: [number, number];
  zoom?: number;
  width?: string | number;
  height?: string | number;
  placemarkText?: string;
  className?: string;
}

const YandexMap = ({
  center = [55.080818, 21.89966],
  zoom = 17,
  width = '100%',
  height = 300,
  placemarkText = 'ул. Победы, 34А, Советск',
  className = '',
}: YandexMapProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Box>
        <Text>Загрузка карты...</Text>
      </Box>
    );
  }

  return (
    <Stack>
      <Text fontSize="2xl" fontWeight="bold">
        Мы на карте
      </Text>
      <Separator />
      <YMaps>
        <Map
          state={{ center, zoom }}
          width="100%"
          height="100%"
          modules={[
            'control.ZoomControl',
            'control.FullscreenControl',
            'control.TypeSelector',
          ]}
        >
          <Placemark
            geometry={center}
            properties={{
              hintContent: placemarkText,
              balloonContent: `
                <div style="padding: 10px;">
                  <strong>ул. Победы, 34А</strong><br/>
                  г. Советск, Калининградская область<br/>
                  <br/>
                  <small>Точка отмечена на карте</small>
                </div>
              `,
            }}
            options={{
              preset: 'islands#darkRedIcon',
            }}
          />
        </Map>
      </YMaps>
    </Stack>
  );
};

export default YandexMap;
