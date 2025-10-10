import { useEffect, useState } from "react";
import { customerApi } from "./api";
import type { ProductDto } from "@/types/product";


import ProductCard from "@/components/shared/ProductCard";

const CustomerProducts = () => {
  const [productsByCategory, setProductsByCategory] = useState<Record<string, ProductDto[]>>({});

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await customerApi.getProducts();
        const groupedProducts: Record<string, ProductDto[]> = {};
        const categoryList: { id: string; name: string }[] = [];
        const categorySet = new Set<string>();

        allProducts.forEach(product => {
          if (!categorySet.has(product.categoryId)) {
            categorySet.add(product.categoryId);
            categoryList.push({
              id: product.categoryId,
              name: product.categoryName,
            });
          }

          if (!groupedProducts[product.categoryId]) {
            groupedProducts[product.categoryId] = [];
          }
          groupedProducts[product.categoryId].push(product);
        });

        setProductsByCategory(groupedProducts);
        setCategories(categoryList);
      } catch (err) {
        console.error("Lỗi load sản phẩm:", err);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
      
      {categories.map(category => (
        <section key={category.id} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-200 pb-2">{category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsByCategory[category.id]?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CustomerProducts;