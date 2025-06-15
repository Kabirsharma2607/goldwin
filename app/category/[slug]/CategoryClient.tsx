"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Filter, Grid3X3, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/ui/product-card";
import { api, Product, Category } from "@/lib/api";

type ViewMode = "grid" | "list";
type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest";

export default function CategoryClient({ slug }: { slug: string }) {
  const params = useParams();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showInStock, setShowInStock] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoryData, productsData] = await Promise.all([
          api.getCategory(slug),
          api.getProducts({ category: slug }),
        ]);

        setCategory(categoryData);
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Set initial price range based on products
        if (productsData.length > 0) {
          const prices = productsData.map((p) => p.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
        }
      } catch (error) {
        console.error("Error loading category data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  useEffect(() => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // On sale filter
    if (showOnSale) {
      filtered = filtered.filter(
        (p) => p.originalPrice && p.originalPrice > p.price
      );
    }

    // In stock filter
    if (showInStock) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Assuming newer products have higher IDs
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, priceRange, showOnSale, showInStock, sortBy]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Category Not Found
        </h1>
        <p className="text-gray-600">
          The category you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={2000}
          min={0}
          step={10}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="on-sale"
            checked={showOnSale}
            onCheckedChange={setShowOnSale}
          />
          <label htmlFor="on-sale" className="text-sm font-medium">
            On Sale
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={showInStock}
            onCheckedChange={setShowInStock}
          />
          <label htmlFor="in-stock" className="text-sm font-medium">
            In Stock Only
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {category.name}
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} of {category.productCount} products
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          {/* Mobile Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine your search results</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sort Dropdown */}
        <Select
          value={sortBy}
          onValueChange={(value: SortOption) => setSortBy(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <FilterContent />
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
