import { useQuery } from '@tanstack/react-query';
import { newsAPI } from '@/lib/api';

export function useLegalNews(category?: string) {
  return useQuery({
    queryKey: ['/api/legal-news', category],
    queryFn: () => newsAPI.getLegalNews(category)
  });
}
