'use client';

import Poster from '@/components/poster/poster';
import News from '@/components/news/news';
import HallPlan from '@/components/hallplan/hallplan';

export default function HomePage() {
  return (
    <>
      <Poster />
      <News />
      <HallPlan />
    </>
  );
}
