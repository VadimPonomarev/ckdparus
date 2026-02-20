'use client';
import PosterGrid from '@/components/poster/postergrid';

export default function PosterGridPage() {
  return (
    <PosterGrid
      showTitle={true}
      showFeaturedOnly={false}
      futureOnly={true}
      initialLimit={16}
      loadMoreCount={16}
    />
  );
}
