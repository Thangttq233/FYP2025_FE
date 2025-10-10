export enum MainCategoryType {
  AoNam = 0,
  QuanNam = 1,
  GiayDep = 2,
  PhuKien = 3,
  QuaTang = 4,
  XTech = 5,
  HangMoi = 6,
  UuDai = 7
}


export interface CategoryDto {
    id: string;
    name: string;
    mainCategory: MainCategoryType;
}

export interface CreateCategoryDto {
    name: string;
    description?: string;
    mainCategory: MainCategoryType;
}

export interface UpdateCategoryDto {
    id: string;
    name?: string;
    description?: string;
    mainCategory?: MainCategoryType;
}

export interface DeleteCategoryDto {
    id: string;
}
