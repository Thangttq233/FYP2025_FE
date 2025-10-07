import React, { useRef, useState } from "react";
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
import type { CategoryDto } from "@/types/categories";
import type { ProductDto, ProductVariantDto } from "@/types/product";

interface ProductFormProps {
  initialData?: ProductDto;
  categories: CategoryDto[];
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<any>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId || "",
    imageFile: null as File | null,
    variants: initialData?.variants || [],
  });

  const [variantForm, setVariantForm] = useState<any>({
    id: "",
    color: "",
    size: "",
    price: 0,
    stockQuantity: 0,
    imageFile: null as File | null,
    imageUrl: "",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const variantFileRef = useRef<HTMLInputElement | null>(null);

  // ✅ Click vào variant để load dữ liệu lên form
  const handleSelectVariant = (variant: ProductVariantDto, index: number) => {
    setVariantForm({
      id: variant.id || "",
    color: variant.color || "",
    size: variant.size || "",
    price: variant.price || 0,
    stockQuantity: variant.stockQuantity || 0,
    imageFile: null,
    imageUrl: variant.imageUrl || "",
    });
    setEditingIndex(index);
  };

  // ✅ Thêm hoặc cập nhật variant
  const handleAddOrUpdateVariant = () => {
    if (!variantForm.color || !variantForm.size) {
      alert("Vui lòng nhập đủ thông tin biến thể");
      return;
    }

    const updatedVariants = [...formData.variants];

    if (editingIndex !== null) {
      // Cập nhật
      updatedVariants[editingIndex] = { ...variantForm };
      setEditingIndex(null);
    } else {
      // Thêm mới
      updatedVariants.push({ ...variantForm });
    }

    setFormData({
      ...formData,
      variants: updatedVariants,
    });

    // Reset form variant
    setVariantForm({
      id: "",
      color: "",
      size: "",
      price: 0,
      stockQuantity: 0,
      imageFile: null,
      imageUrl: "",
    });
    if (variantFileRef.current) variantFileRef.current.value = "";
  };

  // ✅ Reset form variant (nút "Thêm mới")
  const handleResetVariantForm = () => {
    setEditingIndex(null);
    setVariantForm({
      id: "",
      color: "",
      size: "",
      price: 0,
      stockQuantity: 0,
      imageFile: null,
      imageUrl: "",
    });
    if (variantFileRef.current) variantFileRef.current.value = "";
  };

  // ✅ Xử lý submit
  const handleSubmit = async () => {
    if (!formData.name || !formData.categoryId) {
      alert("Vui lòng nhập tên sản phẩm và chọn danh mục");
      return;
    }

    const fd = new FormData();
    fd.append("Name", formData.name);
    fd.append("Description", formData.description);
    fd.append("CategoryId", formData.categoryId);

    const category = categories.find((c) => c.id === formData.categoryId);
    if (category) fd.append("CategoryName", category.name);

    if (formData.imageFile) fd.append("ImageFile", formData.imageFile);

    formData.variants.forEach((v: any, index: number) => {
      if (v.id) fd.append(`Variants[${index}].Id`, v.id);
      fd.append(`Variants[${index}].Color`, v.color);
      fd.append(`Variants[${index}].Size`, v.size);
      fd.append(`Variants[${index}].Price`, String(v.price));
      fd.append(`Variants[${index}].StockQuantity`, String(v.stockQuantity));
      if (v.imageFile)
        fd.append(`Variants[${index}].ImageFile`, v.imageFile);
      else if (v.imageUrl)
        fd.append(`Variants[${index}].ImageUrl`, v.imageUrl);
    });

    await onSubmit(fd);
  };

  return (
    <div className="grid grid-cols-2 gap-6 mt-4">
      {/* Thông tin sản phẩm */}
      <div className="space-y-4">
        <div>
          <Label>Tên sản phẩm</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <Label>Mô tả</Label>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Danh mục</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Ảnh sản phẩm chính</Label>
          <Input
            type="file"
            onChange={(e) =>
              setFormData({
                ...formData,
                imageFile: e.target.files ? e.target.files[0] : null,
              })
            }
          />
        </div>
      </div>

      {/* Biến thể sản phẩm */}
      <div className="space-y-4 border-l pl-4">
        <h3 className="font-semibold">
          {editingIndex !== null ? "Chỉnh sửa phiên bản" : "Thêm phiên bản"}
        </h3>

        <div>
          <Label>Màu sắc</Label>
          <Input
            value={variantForm.color}
            onChange={(e) =>
              setVariantForm({ ...variantForm, color: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Kích cỡ</Label>
          <Input
            value={variantForm.size}
            onChange={(e) =>
              setVariantForm({ ...variantForm, size: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Giá</Label>
          <Input
            type="number"
            value={variantForm.price}
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                price: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <Label>Số lượng</Label>
          <Input
            type="number"
            value={variantForm.stockQuantity}
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                stockQuantity: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <Label>Ảnh phiên bản</Label>
          <Input
            type="file"
            ref={variantFileRef}
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                imageFile: e.target.files ? e.target.files[0] : null,
              })
            }
          />
          {variantForm.imageUrl && (
            <img
              src={variantForm.imageUrl}
              alt="Variant Preview"
              className="w-20 h-20 object-cover mt-2 rounded"
            />
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddOrUpdateVariant}>
            {editingIndex !== null ? "Cập nhật phiên bản" : "Thêm phiên bản"}
          </Button>
          <Button variant="secondary" onClick={handleResetVariantForm}>
            Thêm mới
          </Button>
        </div>

        <ul className="space-y-1 mt-2">
          {formData.variants.map((v: any, idx: number) => (
            <li
              key={idx}
              onClick={() => handleSelectVariant(v, idx)}
              className={`text-sm border p-1 rounded cursor-pointer hover:bg-gray-100 ${
                editingIndex === idx ? "bg-blue-50 border-blue-400" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {v.imageUrl && (
                  <img
                    src={v.imageUrl}
                    alt={v.color}
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <span>
                  {v.color} - {v.size} | {v.price}₫ | SL: {v.stockQuantity}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Action */}
      <div className="col-span-2 flex justify-end gap-2 mt-4">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading
            ? "Đang lưu..."
            : initialData
            ? "Cập nhật sản phẩm"
            : "Thêm sản phẩm"}
        </Button>
        <Button variant="destructive" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
