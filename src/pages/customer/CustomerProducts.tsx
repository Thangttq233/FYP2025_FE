import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
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
    <div className="container mx-auto px-4 pb-12">
      <div className="py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">Tất cả sản phẩm</h1>
      </div>

      <div className="sticky top-[60px] z-30 bg-white py-4 mb-8 shadow-sm -mx-4 px-4 md:mx-0 md:px-0 md:static md:shadow-none md:py-0">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={filterName}
                    onChange={e => setFilterName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
            
            <div className="grid grid-cols-2 w-full md:w-auto gap-3">
                <input
                    type="number"
                    placeholder="Giá thấp nhất"
                    value={filterMinPrice ?? ""}
                    onChange={e => setFilterMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full md:w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                    type="number"
                    placeholder="Giá cao nhất"
                    value={filterMaxPrice ?? ""}
                    onChange={e => setFilterMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full md:w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>

            <div className="relative w-full md:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                    value={filterCategoryId ?? ""}
                    onChange={e => setFilterCategoryId(e.target.value || undefined)}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {categories.map(category => (
        <section key={category.id} className="mb-10">
          <div className="flex items-center mb-4 border-b border-gray-100 pb-2">
             <h2 className="text-xl md:text-2xl font-bold text-gray-800 mr-4">{category.name}</h2>
             <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {productsByCategory[category.id]?.length} sản phẩm
             </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {productsByCategory[category.id]?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
      
      {categories.length === 0 && (
          <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
          </div>
      )}
    </div>
  );
};

export default CustomerProducts;