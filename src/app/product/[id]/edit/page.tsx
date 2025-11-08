'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { productApi, Product } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [categories, setCategories] = useState<{ slug: string; name: string; url: string }[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    brand: '',
    category: '',
  });

  useEffect(() => {
    // Protect this route - redirect if not logged in
    if (!isAuthenticated) {
      toast.error('You must be logged in to edit products');
      router.push(`/login?returnUrl=/product/${productId}/edit`);
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both in parallel to speed things up
        const [productData, cats] = await Promise.all([
          productApi.getProductById(productId),
          productApi.getCategories(),
        ]);
        
        setProduct(productData);
        setCategories(cats);
        
        // Category matching is a bit tricky - API returns different formats
        // Try to match by name or slug, fallback to original value
        const categorySlug = cats.find(cat => cat.name.toLowerCase() === productData.category.toLowerCase() || cat.slug === productData.category)?.slug || productData.category;
        
        setFormData({
          title: productData.title,
          description: productData.description,
          price: productData.price.toString(),
          stock: productData.stock.toString(),
          brand: productData.brand,
          category: categorySlug,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
        toast.error(errorMessage);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId, router, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication before submitting
    if (!isAuthenticated) {
      toast.error('You must be logged in to update products');
      router.push(`/login?returnUrl=/product/${productId}/edit`);
      return;
    }
    
    if (!formData.title || !formData.description || !formData.price || !formData.stock || !formData.brand || !formData.category || formData.category === 'none') {
      setStatus('error');
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSaving(true);
      setStatus('idle');
      await productApi.updateProduct(productId, {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        brand: formData.brand,
        category: formData.category,
      });
      
      setStatus('success');
      toast.success('Product updated successfully!');
      
      // Keep success border visible briefly, then navigate
      // Use replace to avoid adding to history stack (so back button goes to home)
      setTimeout(() => {
        router.replace(`/product/${productId}`);
      }, 1000);
    } catch (err: any) {
      setStatus('error');
      let errorMessage = 'Failed to update product';
      
      if (err?.response) {
        const responseData = err.response.data;
        if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else {
          errorMessage = `Request failed with status code ${err.response.status}`;
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage, {
        description: 'Please check your input and try again.',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Skeleton className="h-10 w-24 mb-6" />
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 sm:mb-6 h-9 sm:h-10"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-sm sm:text-base">Back</span>
        </Button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Edit Product</h1>

      <form 
        onSubmit={handleSubmit} 
        className={`space-y-6 p-6 rounded-lg border-2 transition-colors duration-300 ${
          status === 'success' 
            ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
            : status === 'error' 
            ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
            : 'border-border'
        }`}
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand *</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Product brand"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="none">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}

