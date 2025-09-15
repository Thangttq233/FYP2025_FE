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
import type { ProductDto } from "@/types/product";

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
    color: "",
    size: "",
    price: 0,
    stockQuantity: 0,
    imageFile: null as File | null,
  });

  const variantFileRef = useRef<HTMLInputElement | null>(null);

  const handleAddVariant = () => {
    if (!variantForm.color || !variantForm.size) {
      alert("Vui lòng nhập đủ thông tin biến thể");
      return;
    }
    setFormData({
      ...formData,
      variants: [...formData.variants, { ...variantForm }],
    });

    setVariantForm({
      color: "",
      size: "",
      price: 0,
      stockQuantity: 0,
      imageFile: null,
    });

    if (variantFileRef.current) {
      variantFileRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    // validate product
    if (!formData.name || !formData.categoryId) {
      alert("Vui lòng nhập tên sản phẩm và chọn danh mục");
      return;
    }

    if (!formData.imageFile) {
      alert("Vui lòng chọn ảnh sản phẩm");
      return;
    }

    // validate variants
    for (const variant of formData.variants) {
      if (!variant.color || !variant.size) {
        alert("Mỗi phiên bản phải có màu và size");
        return;
      }
      if (variant.price <= 0) {
        alert("Giá của phiên bản phải lớn hơn 0");
        return;
      }
      if (variant.stockQuantity < 0) {
        alert("Số lượng tồn kho không hợp lệ");
        return;
      }
    }
    const fd = new FormData();
    fd.append("Name", formData.name);
    fd.append("Description", formData.description);
    fd.append("CategoryId", formData.categoryId);

    const category = categories.find((c) => c.id === formData.categoryId);
    if (category) {
      fd.append("CategoryName", category.name);
    }

    if (formData.imageFile) {
      fd.append("ImageFile", formData.imageFile);
    }

    formData.variants.forEach((v: any, index: number) => {
      fd.append(`Variants[${index}].Color`, v.color);
      fd.append(`Variants[${index}].Size`, v.size);
      fd.append(`Variants[${index}].Price`, String(v.price));
      fd.append(`Variants[${index}].StockQuantity`, String(v.stockQuantity));
      if (v.imageFile) {
        fd.append(`Variants[${index}].ImageFile`, v.imageFile);
      }
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
            onValueChange={(value: any) =>
              setFormData({ ...formData, categoryId: value })
            }
            value={formData.categoryId}
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
        <h3 className="font-semibold">Thêm phiên bản</h3>

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
        </div>

        <Button variant="outline" onClick={handleAddVariant}>
          Thêm phiên bản
        </Button>

        <ul className="space-y-1 mt-2">
          {formData.variants.map((v: any, idx: number) => (
            <li key={idx} className="text-sm border p-1 rounded">
              {v.color} - {v.size} | {v.price}₫ | SL: {v.stockQuantity}
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
