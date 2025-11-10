'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { Heart } from 'lucide-react';
import { productApi, Product } from '@/lib/api';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const router = useRouter();
  const favoriteIds = useAppSelector((state) => state.favorites.items);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your favorites');
      router.push('/login?returnUrl=/favorites');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Don't fetch if user is not authenticated
    if (!isAuthenticated) {
      return;
    }

    const fetchFavoriteProducts = async () => {
      if (favoriteIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all products in parallel
        const productPromises = favoriteIds.map((id) =>
          productApi.getProductById(id).catch((err) => {
            console.error(`Failed to fetch product ${id}:`, err);
            return null; // Return null for failed fetches
          })
        );
        
        const fetchedProducts = await Promise.all(productPromises);
        // Filter out null values (failed fetches)
        const validProducts = fetchedProducts.filter(
          (product): product is Product => product !== null
        );
        
        setProducts(validProducts);
      } catch (error) {
        console.error('Failed to fetch favorite products:', error);
        toast.error('Failed to load favorite products');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favoriteIds, isAuthenticated]);

  // Don't render content if user is not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">My Favorites</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {favoriteIds.length} {favoriteIds.length === 1 ? 'product' : 'products'} saved
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: Math.min(favoriteIds.length || 5, 10) }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4">
          <div className="relative">
            <Heart className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/50 mb-4 animate-pulse" />
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
          </div>
          <p className="text-muted-foreground text-base sm:text-lg font-medium text-center">
            No favorite products yet
          </p>
          <p className="text-muted-foreground text-sm sm:text-base text-center">
            Start adding products to your favorites!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

