// app/news/page.tsx
'use client';

import NewsGrid from '@/components/news/newsgrid';

export default function NewsPage() {
  return (
    <NewsGrid
      showTitle={true}
      publishedOnly={true}
      initialLimit={12}
      loadMoreCount={12}
    />
  );
}
