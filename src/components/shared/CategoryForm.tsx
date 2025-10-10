import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainCategoryType, type CategoryDto } from "@/types/categories";

interface CategoryFormProps {
  initialData?: CategoryDto;
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    mainCategory: initialData?.mainCategory ?? MainCategoryType.AoNam,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Label>Tên danh mục</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <Label>Danh mục chính</Label>
        <Select
          value={String(formData.mainCategory)}
          onValueChange={(value) =>
            setFormData({ ...formData, mainCategory: Number(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục chính" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MainCategoryType)
              .filter(([key]) => isNaN(Number(key))) // Filter out numeric keys
              .map(([key, value]) => (
                <SelectItem key={key} value={String(value)}>
                  {key}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang lưu..." : initialData ? "Cập nhật" : "Thêm"}
        </Button>
        <Button type="button" variant="destructive" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
