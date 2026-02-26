'use client';

import Poster from '@/components/poster/poster';
import News from '@/components/news/news';
import HallPlan from '@/components/hallplan/hallplan';
import YandexMapChakraIframe from '@/components/yandexmap/YandexMapChakraIframe';
import { Button, Center } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  return (
    <>
      <Poster />
      <Center>
        <Button
          w="200px"
          bgColor="blue.500"
          onClick={() => {
            router.push('/allevents');
          }}
        >
          Все события
        </Button>
      </Center>
      <News />
      <Center>
        <Button
          w="200px"
          bgColor="blue.500"
          onClick={() => {
            router.push('/allnews');
          }}
        >
          Все новости
        </Button>
      </Center>
      <HallPlan />
      <YandexMapChakraIframe />
    </>
  );
}
