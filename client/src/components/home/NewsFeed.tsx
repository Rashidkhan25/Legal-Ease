import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ArrowRight, RefreshCw, Newspaper } from 'lucide-react';
import { useLegalNews } from '@/hooks/useLegalNews';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function NewsFeed() {
  const { data: articles, isLoading, error } = useLegalNews();
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };
  
  if (error) {
    return (
      <div className="mb-12">
        <div className="text-center py-12 animate-fade-in">
          <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin-slow" />
          <h2 className="text-2xl font-bold text-primary font-serif mb-4">Latest Legal News</h2>
          <p className="text-gray-500 mb-6">Failed to load news articles. Please try again later.</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-12 mb-16">
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-24 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mb-4"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4">Latest Legal News</h2>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          Stay informed with the latest updates in the legal world, landmark cases, and important law changes.
        </p>
        <Link href="/news">
          <div className="text-gray-500 hover:text-gray-900 flex items-center text-sm font-medium mx-auto w-fit mt-4 group hover:translate-x-1 transition-all duration-300">
            View all news
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {isLoading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, i) => (
            <div key={i} className={`animate-fade-in-up animation-delay-${i * 100}`}>
              <Card className="overflow-hidden h-full">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-5">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Skeleton className="h-4 w-20 mr-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          // Actual news articles
          articles?.slice(0, 3).map((article: any, index: number) => (
            <div 
              key={index} 
              className={`animate-fade-in-up animation-delay-${(index + 2) * 100}`}
            >
              <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl border-none transition-all duration-300 hover:-translate-y-2">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <Badge className="absolute top-3 right-3 bg-primary/60 text-white">
                    {article.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{formatDate(article.publishDate)}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-primary line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.content}</p>
                  <Link href={`/news/${article.id}`}>
                    <div className="text-gray-400 hover:text-gray-900 font-medium flex items-center group w-fit hover:translate-x-1 transition-all duration-300">
                      Read more
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
      
      {!isLoading && articles?.length > 0 && (
        <div className="mt-12 text-center animate-fade-in-up animation-delay-800">
          <div className="inline-flex items-center bg-secondary/10 px-6 py-3 rounded-full">
            <Newspaper className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-500">Subscribe to our legal newsletter for weekly updates</span>
          </div>
        </div>
      )}
    </div>
  );
}
