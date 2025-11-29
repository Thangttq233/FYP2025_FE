import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminhApi } from "./api";
import type { CategoryDto } from "@/types/categories";
import CategoryForm from "@/components/shared/CategoryForm";
import { MainCategoryType } from "@/types/categories";
import { Plus, Pencil, Trash2, List, Tag } from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | undefined>(
    undefined
  );

  const mainCategoryMap: { [key in MainCategoryType]: string } = {
    [MainCategoryType.AoNam]: "Áo Nam",
    [MainCategoryType.QuanNam]: "Quần Nam",
    [MainCategoryType.GiayDep]: "Giày Dép",
    [MainCategoryType.PhuKien]: "Phụ Kiện",
    [MainCategoryType.QuaTang]: "Quà Tặng",
    [MainCategoryType.XTech]: "X-Tech",
    [MainCategoryType.HangMoi]: "Hàng Mới",
    [MainCategoryType.UuDai]: "Ưu Đãi",
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const catRes: CategoryDto[] = await adminhApi.getCategories();
      setCategories(catRes);
    } catch (err) {
      setError("Failed to fetch categories.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await adminhApi.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        setError("Failed to delete category.");
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      if (editingCategory) {
        await adminhApi.updateCategory(editingCategory.id, formData);
      } else {
        await adminhApi.createCategory(formData);
      }
      fetchCategories();
      setIsFormOpen(false);
      setEditingCategory(undefined);
    } catch (err) {
      setError("Failed to save category.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: CategoryDto) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCategory(undefined);
  };

  const handleAddNew = () => {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý Danh mục</h1>
            <p className="text-gray-500 text-sm mt-1">Danh sách tất cả danh mục sản phẩm</p>
        </div>
        <Button onClick={handleAddNew} className="w-full md:w-auto flex items-center gap-2 shadow-md">
            <Plus size={18} /> Thêm danh mục
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            initialData={editingCategory}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {isLoading && categories.length === 0 && (
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p>Đang tải dữ liệu...</p>
        </div>
      )}
      
      {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
            {error}
          </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="hidden md:table-header-group bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Tên danh mục</th>
              <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">Nhóm chính</th>
              <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {categories.map((category) => (
              <tr 
                key={category.id} 
                className="block md:table-row border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <td className="block md:table-cell py-3 px-4 md:py-4 md:px-6">
                    <div className="flex justify-between items-center md:block">
                        <span className="font-semibold text-gray-600 md:hidden text-sm bg-gray-100 px-2 py-1 rounded">Tên:</span>
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                            <Tag size={16} className="text-blue-500 hidden md:block" />
                            {category.name}
                        </div>
                    </div>
                </td>
                
                <td className="block md:table-cell py-3 px-4 md:py-4 md:px-6 text-left md:text-center">
                    <div className="flex justify-between items-center md:justify-center">
                        <span className="font-semibold text-gray-600 md:hidden text-sm bg-gray-100 px-2 py-1 rounded">Nhóm:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {mainCategoryMap[category.mainCategory]}
                        </span>
                    </div>
                </td>

                <td className="block md:table-cell py-4 px-4 md:py-4 md:px-6 md:text-right border-t md:border-t-0 border-gray-50 mt-2 md:mt-0">
                  <div className="flex justify-end gap-2">
                    <Button 
                        onClick={() => handleEdit(category)} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                    >
                      <Pencil size={14} /> <span className="md:hidden lg:inline">Sửa</span>
                    </Button>
                    <Button
                      onClick={() => handleDelete(category.id)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={14} /> <span className="md:hidden lg:inline">Xóa</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {categories.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                <List size={48} className="text-gray-300 mb-3" />
                <p>Chưa có danh mục nào được tạo.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;