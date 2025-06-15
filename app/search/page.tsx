'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/product-card';
import { api, Product } from '@/lib/api';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearchPerformed(true);
    
    try {
      const results = await api.getProducts({ search: searchQuery.trim() });
      setProducts(results);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Search Products
        </h1>
        
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
          <Button type="submit" size="lg" className="bg-yellow-500 hover:bg-yellow-600">
            Search
          </Button>
        </form>
        
        {initialQuery && (
          <p className="text-gray-600 mt-4 text-center">
            {loading ? 'Searching...' : `Search results for "${initialQuery}"`}
          </p>
        )}
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : searchPerformed ? (
        products.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found {products.length} result{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No results found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{initialQuery}". 
                Try adjusting your search terms or browse our categories.
              </p>
              <Button asChild>
                <a href="/category/electronics">Browse Categories</a>
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Start your search
          </h2>
          <p className="text-gray-600">
            Enter a search term above to find the products you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}