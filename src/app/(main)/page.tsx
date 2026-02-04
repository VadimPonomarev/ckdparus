'use client';

import Poster from '@/components/poster/poster';
import News from '@/components/news/news';
import HallPlan from '@/components/hallplan/hallplan';
import YandexMapChakraIframe from '@/components/yandexmap/YandexMapChakraIframe';

export default function HomePage() {
  return (
    <>
      <Poster />
      <News />
      <HallPlan />
      <YandexMapChakraIframe />
    </>
  );
}
