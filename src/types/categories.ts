// src/types/categories.ts

export interface CategoryDto {
    id: string;
    name: string;
}

export interface CreateCategoryDto {
    name: string;
    description?: string;
}

export interface UpdateCategoryDto {
    id: string;
    name?: string;
    description?: string;
}

export interface DeleteCategoryDto {
    id: string;
}
