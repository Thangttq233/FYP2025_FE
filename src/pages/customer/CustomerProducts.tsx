import { useEffect, useState } from "react";
import { customerApi } from "./api";
import type { ProductDto } from "@/types/product";
import ProductCard from "@/components/shared/ProductCard";

const CustomerProducts = () => {
  const [productsByCategory, setProductsByCategory] = useState<Record<string, ProductDto[]>>({});
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filterName, setFilterName] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState<number | undefined>();
  const [filterMaxPrice, setFilterMaxPrice] = useState<number | undefined>();
  const [filterCategoryId, setFilterCategoryId] = useState<string | undefined>();

  const fetchProducts = async () => {
    try {
      const allProducts = filterName || filterMinPrice || filterMaxPrice || filterCategoryId
        ? await customerApi.getFilteredProducts({
            name: filterName,
            minPrice: filterMinPrice,
            maxPrice: filterMaxPrice,
            categoryId: filterCategoryId,
          })
        : await customerApi.getProducts();
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
        if (!groupedProducts[product.categoryId]) groupedProducts[product.categoryId] = [];
        groupedProducts[product.categoryId].push(product);
      });
      setProductsByCategory(groupedProducts);
      setCategories(categoryList);
    } catch (err) {
      console.error("Lỗi load sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterName, filterMinPrice, filterMaxPrice, filterCategoryId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">All Products</h1>
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search name..."
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
          className="border p-2 rounded w-60"
        />
        <input
          type="number"
          placeholder="Min price"
          value={filterMinPrice ?? ""}
          onChange={e => setFilterMinPrice(e.target.value ? Number(e.target.value) : undefined)}
          className="border p-2 rounded w-32"
        />
        <input
          type="number"
          placeholder="Max price"
          value={filterMaxPrice ?? ""}
          onChange={e => setFilterMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
          className="border p-2 rounded w-32"
        />
        <select
          value={filterCategoryId ?? ""}
          onChange={e => setFilterCategoryId(e.target.value || undefined)}
          className="border p-2 rounded w-40"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
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
