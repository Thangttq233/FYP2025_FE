import type { UserRole } from "./user";

// src/types/auth.ts
export interface RegisterRequestDto {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    dateOfBirth: string;
}


export interface LoginRequestDto {
    email: string;
    password: string;
}


export interface RefreshTokenRequestDto {
    accessToken: string;
    refreshToken: string;
}


export interface RevokeTokenRequestDto {
    refreshToken: string;
}

export interface AssignRoleRequestDto {
    email: string;
    roleName: string;
}


export interface AuthResponseDto {
    userId: string;
    email: string;
    userName: string;
    fullName: string;
    roles: UserRole[];
    token: string;
    expiration: string;
    isSuccess: boolean;
    errors: string[];
    refreshToken: string;
}


export interface AuthCheckResponse {
    message: string;
    userId: string;
    userName: string;
    email: string;
    roles: string[];
}


export interface MessageResponse {
    message: string;
}
