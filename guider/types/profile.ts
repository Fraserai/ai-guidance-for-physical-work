export type UserProfile = {
  id: string;
  email?: string;
  firstName: string;
  roleCategoryId?: string;
  roleCategoryHeading?: string;
  roleName?: string;
  customRole?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RoleSelectionPayload = {
  roleCategoryId: string;
  roleCategoryHeading: string;
  roleName: string;
  customRole?: string;
};
