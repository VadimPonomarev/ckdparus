'use client';

import Poster from '@/components/poster/poster';
import News from '@/components/news/news';
import HallPlan from '@/components/hallplan/hallplan';
import YandexMapChakraIframe from '@/components/yandexmap/YandexMapChakraIframe';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  return (
    <>
      <Poster />
      <Button
        onClick={() => {
          router.push('/allevents');
        }}
      >
        Все события
      </Button>
      <News />
      <HallPlan />
      <YandexMapChakraIframe />
    </>
  );
}
