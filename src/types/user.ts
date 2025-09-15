// src/interfaces/user.ts


export type UserRole = "Admin" | "Saler" | "Customer";
export interface User {
    userId: string;
    email: string;
    userName: string;
    fullName: string;
    roles: UserRole;
}

// GET /check
export interface CheckUserResponse {
    message: string;
    userId: string;
    userName: string;
    email: string;
    roles: string[];
}

// GET /{userId}/roles
export interface UserRolesResponse {
    roles: string[];
}

// Request assign/remove role
export interface AssignRoleRequestDto {
    email: string;
    roleName: string;
}

// Response  assign/remove role 
export interface AssignRoleResponse {
    message: string;
}
