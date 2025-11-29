import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adminhApi } from "./api";
import type { CategoryDto } from "@/types/categories";
import { type ProductDto } from "@/types/product";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import ProductForm from "@/components/shared/ProductForm";
import { Plus, Pencil, Trash2, Package, Layers, Info, Tag } from "lucide-react";

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);

  const fetchData = async () => {
    try {
      const prodRes: ProductDto[] = await adminhApi.getAllProduct();
      const catRes: CategoryDto[] = await adminhApi.getCategories();
      setProducts(prodRes || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await adminhApi.deleteProduct(id);
      await fetchData();
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm!");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddProduct = async (fd: FormData) => {
    try {
      setIsSubmitting(true);
      await adminhApi.createProduct(fd);
      await fetchData();
      toast.success("Thêm sản phẩm thành công!");
      setOpen(false);
    } catch (err) {
      console.error("Failed to create product:", err);
      toast.error("Có lỗi khi thêm sản phẩm!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (fd: FormData) => {
    if (!editingProduct) return;

    try {
      setIsSubmitting(true);
      await adminhApi.updateProduct(editingProduct.id, fd);
      await fetchData();
      toast.success("Cập nhật sản phẩm thành công!");
      setEditingProduct(null);
    } catch (err) {
      console.error("Failed to update product:", err);
      toast.error("Có lỗi khi cập nhật sản phẩm!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý sản phẩm</h1>
             <p className="text-gray-500 text-sm mt-1">Tổng số: {products.length} sản phẩm</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto shadow-md">
                <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] max-w-[900px] h-[90vh] overflow-y-auto rounded-xl">
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
              </DialogHeader>

              <ProductForm
                categories={categories}
                onSubmit={handleAddProduct}
                onCancel={() => setOpen(false)}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Dialog
          open={!!editingProduct}
          onOpenChange={(isOpen) => !isOpen && setEditingProduct(null)}
        >
          <DialogContent className="w-[95vw] max-w-[900px] h-[90vh] overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            </DialogHeader>

            {editingProduct && (
                <ProductForm
                initialData={editingProduct}
                categories={categories}
                onSubmit={handleUpdateProduct}
                onCancel={() => setEditingProduct(null)}
                isLoading={isSubmitting}
                />
            )}
          </DialogContent>
        </Dialog>

        <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b hidden md:table-header-group">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm">Ảnh</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Tên sản phẩm</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Danh mục</th>
                <th className="p-4 font-semibold text-gray-600 text-sm w-1/4">Mô tả</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Phiên bản (SKU)</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="block md:table-row hover:bg-gray-50 transition-colors">
                  
                  <td className="block md:table-cell p-4">
                    <div className="flex items-center gap-4 md:block">
                        {p.imageUrl ? (
                        <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-20 h-20 md:w-16 md:h-16 object-cover rounded-lg border border-gray-200 shadow-sm mx-auto md:mx-0"
                        />
                        ) : (
                        <div className="w-20 h-20 md:w-16 md:h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mx-auto md:mx-0">
                            <Package size={24} />
                        </div>
                        )}
                        <div className="md:hidden flex-1">
                            <h3 className="font-bold text-gray-900 line-clamp-2">{p.name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">
                                <Tag size={12} /> {p.categoryName}
                            </div>
                        </div>
                    </div>
                  </td>

                  <td className="hidden md:table-cell p-4 font-medium text-gray-900 max-w-[200px]">
                    {p.name}
                  </td>
                  
                  <td className="hidden md:table-cell p-4 text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">{p.categoryName}</span>
                  </td>

                  <td className="block md:table-cell p-4 text-sm text-gray-500 md:max-w-[250px]">
                    <div className="md:hidden font-semibold text-gray-700 mb-1">Mô tả:</div>
                    <p className="line-clamp-2 md:line-clamp-3">{p.description}</p>
                  </td>

                  <td className="block md:table-cell p-4">
                    <div className="md:hidden font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Layers size={16} /> Các phiên bản:
                    </div>
                    
                    {/* Mobile: Scrollable list */}
                    <div className="md:hidden flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {p.variants?.map((v) => (
                            <div key={v.id} className="flex-shrink-0 border rounded-lg p-2 bg-gray-50 text-xs min-w-[100px]">
                                <div className="font-bold text-gray-800">{v.color} - {v.size}</div>
                                <div className="text-blue-600 font-semibold">{v.price.toLocaleString()}đ</div>
                                <div className="text-gray-500">Kho: {v.stockQuantity}</div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Tooltip list */}
                    <ul className="hidden md:flex flex-wrap gap-1">
                      {p.variants?.map((v) => (
                        <li key={v.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="border rounded-md flex items-center gap-2 cursor-pointer hover:bg-blue-50 hover:border-blue-200 p-1.5 transition-colors">
                                {v.imageUrl && (
                                  <img
                                    src={v.imageUrl}
                                    alt={v.color}
                                    className="w-6 h-6 object-cover rounded"
                                  />
                                )}
                                <span className="text-xs font-medium">
                                  {v.color}-{v.size}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-gray-800 border shadow-xl p-3 rounded-lg">
                              <div className="space-y-1 text-sm">
                                <p><strong>Màu:</strong> {v.color}</p>
                                <p><strong>Size:</strong> {v.size}</p>
                                <p><strong>Giá:</strong> {v.price.toLocaleString()}₫</p>
                                <p><strong>Kho:</strong> {v.stockQuantity}</p>
                                {v.imageUrl && (
                                  <img src={v.imageUrl} alt={v.color} className="w-full h-32 object-cover rounded mt-2" />
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </li>
                      ))}
                      {(!p.variants || p.variants.length === 0) && <span className="text-gray-400 italic text-xs">Chưa có phiên bản</span>}
                    </ul>
                  </td>

                  <td className="block md:table-cell p-4 text-right border-t md:border-t-0 border-gray-100">
                    <div className="flex justify-end gap-2 w-full md:w-auto">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 md:flex-none"
                        onClick={() => setEditingProduct(p)}
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 md:flex-none"
                        onClick={() => {
                          if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
                            handleDelete(p.id);
                          }
                        }}
                        disabled={deletingId === p.id}
                      >
                        {deletingId === p.id ? (
                            <span className="animate-pulse">Xóa...</span>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-1" /> Xóa
                            </>
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                  <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        <Package size={48} className="mx-auto text-gray-300 mb-3" />
                        Chưa có sản phẩm nào. Hãy thêm mới!
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminProducts;