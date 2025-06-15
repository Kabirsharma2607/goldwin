import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/lib/api';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm opacity-90">
                {category.productCount} products
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}