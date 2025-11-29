import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { customerApi } from './api';
import type { ProductDto } from '@/types/product';
import type { CategoryDto } from '@/types/categories';
import ProductCard from '@/components/shared/ProductCard';

const CategoryProductsPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [category, setCategory] = useState<CategoryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoryData] = await Promise.all([
          customerApi.getProductsByCategoryId(categoryId),
          customerApi.getCategoryDetails(categoryId),
        ]);
        setProducts(productsData);
        setCategory(categoryData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu cho danh mục:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (isLoading) {
    return (
        <div className="min-h-[60vh] flex justify-center items-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 uppercase">
          {category ? category.name : 'Sản phẩm'}
        </h1>
        <div className="w-16 h-1 bg-blue-600 mx-auto mt-2 rounded-full"></div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg text-center px-4">
          <p className="text-gray-500 font-medium">
            Chưa có sản phẩm nào trong danh mục này.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;