import React, { useEffect, useRef, useState } from "react";
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
import type { ProductDto } from "@/types/product";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import ProductForm from "@/components/shared/ProductForm";
const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const prodRes: ProductDto[] = await adminhApi.getAllProdct();
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
      setIsLoading(true);
      await adminhApi.createProduct(fd);
      await fetchData();
      toast.success("Thêm sản phẩm thành công!");
      setOpen(false);
    } catch (err) {
      console.error("Failed to create product:", err);
      toast.error("Có lỗi khi thêm sản phẩm!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>➕ Thêm sản phẩm</Button>
          </DialogTrigger>

          <DialogContent className="!max-w-[70vw] w-full h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            </DialogHeader>

            <ProductForm
              categories={categories}
              onSubmit={handleAddProduct}
              onCancel={() => setOpen(false)}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
          <table className="w-full border-collapse border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Ảnh</th>
                <th className="border p-2">Tên</th>
                <th className="border p-2">Mô tả</th>
                <th className="border p-2">Danh mục</th>
                <th className="border p-2">Phiên bản</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="text-sm">
                  <td className="border p-2 text-center">
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded mx-auto"
                      />
                    )}
                  </td>
                  <td className="border p-2 font-medium">{p.name}</td>
                  <td className="border p-2">{p.description}</td>
                  <td className="border p-2">{p.categoryName}</td>
                  <td className="border p-2">
                    <ul className="space-y-1">
                      {p.variants?.map((v) => (
                        <li key={v.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="border rounded flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1">
                                {v.imageUrl && (
                                  <img
                                    src={v.imageUrl}
                                    alt={v.color}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                                <span>
                                  {v.color} - {v.size}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="w-64">
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Màu:</strong> {v.color}
                                </p>
                                <p>
                                  <strong>Kích cỡ:</strong> {v.size}
                                </p>
                                <p>
                                  <strong>Giá:</strong> {v.price}₫
                                </p>
                                <p>
                                  <strong>Số lượng:</strong> {v.stockQuantity}
                                </p>
                                {v.imageUrl && (
                                  <img
                                    src={v.imageUrl}
                                    alt={v.color}
                                    className="w-20 h-20 object-cover rounded mt-2"
                                  />
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <Button size="sm">Chỉnh sửa</Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-[80px]"
                      onClick={() => {
                        if (
                          confirm(
                            "Bạn có chắc chắn muốn xóa sản phẩm này không?"
                          )
                        ) {
                          handleDelete(p.id);
                        }
                      }}
                      disabled={deletingId === p.id}
                    >
                      {deletingId === p.id ? "Đang xóa..." : "Xóa"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminProducts;
