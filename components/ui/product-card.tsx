'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/lib/api';
import { cartStorage } from '@/lib/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      cartStorage.addToCart(product);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
          
          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={handleAddToCart}
              disabled={isLoading || !product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {!product.inStock && (
              <p className="text-sm text-red-500 font-medium">Out of Stock</p>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}