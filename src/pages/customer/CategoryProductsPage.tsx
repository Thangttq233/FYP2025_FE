// src/pages/customer/CategoryProductsPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { customerApi } from './api';
import type { ProductDto } from '@/types/product';
import type { CategoryDto } from '@/types/categories';
import ProductCard from '@/components/shared/ProductCard'; // Dùng lại ProductCard

const CategoryProductsPage = () => {
  // Lấy categoryId từ URL, ví dụ: /category/abc-123 -> categoryId là "abc-123"
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [category, setCategory] = useState<CategoryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Gọi đồng thời cả hai API để tiết kiệm thời gian
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
  }, [categoryId]); // useEffect sẽ chạy lại mỗi khi categoryId trên URL thay đổi

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {category ? `Sản phẩm thuộc danh mục: ${category.name}` : 'Sản phẩm'}
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Chưa có sản phẩm nào trong danh mục này.
        </p>
      )}
    </div>
  );
};

export default CategoryProductsPage;