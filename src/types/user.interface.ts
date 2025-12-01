// types/user-info.ts
export interface UserInfo {
  // User fields
  id: string;
  email: string;
  name: string;
  role: UserRole;
  gender?: Gender;
  phone?: string;
  profileImageUrl?: string;
  userStatus: UserStatus;
  needPasswordChange: boolean; // Note: Changed from needPasswordReset for consistency
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Optional related data
  userAddresses?: UserAddress[];

  // You can extend this interface based on what data you need
  permissions?: string[];
}

// Supporting interfaces
export interface UserAddress {
  id: string;
  addressName: string;
  email?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  addressId: string;
  address: Address;
}

export interface Address {
  id: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Re-export your enums
export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "PRODUCT_MANAGER"
  | "CUSTOMER_SUPPORT"
  | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "DELETED";
export type Gender = "MALE" | "FEMALE" | "OTHER";
