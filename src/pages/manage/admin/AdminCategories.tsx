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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <div className="mb-4">
        <Button onClick={handleAddNew}>Add New Category</Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
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
      {isLoading && categories.length === 0 && <p>Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b text-center">Main Category</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="py-2 px-4 border-b">{category.name}</td>
              <td className="py-2 px-4 border-b text-center">
                {mainCategoryMap[category.mainCategory]}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <Button onClick={() => handleEdit(category)} className="mr-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(category.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategories;