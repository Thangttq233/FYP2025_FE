// src/interfaces/product.ts

// Product Variant (biến thể của sản phẩm)
export interface ProductVariantDto {
    id: string;
    color: string;
    size: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    productId: string;
}

// Product chính
export interface ProductDto {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    categoryId: string;
    categoryName: string;
    variants: ProductVariantDto[];
}

// Request khi tạo mới variant
export interface CreateProductVariantDto {
    color: string;
    size: string;
    price: number;
    stockQuantity: number;
    imageFile: File; // IFormFile => FE sẽ dùng File
}

// Request khi tạo sản phẩm mới
export interface CreateProductDto {
    name: string;
    description: string;
    categoryId: string;
    imageFile: File; // IFormFile => FE sẽ dùng File
    variants: CreateProductVariantDto[];
}

// Request update variant
export interface UpdateProductVariantDto {
    color: string;
    size: string;
    price: number;
    stockQuantity: number;
}

// Request update sản phẩm
export interface UpdateProductDto {
    name: string;
    description: string;
    categoryId: string;
    imageUrl: string;
    variants: UpdateProductVariantDto[];
}
