export interface User {
  id?: string;
  fullName?: string;
  birthday?: Date | null;
  gender?: string;
  address?: string;
  email?: {
    label: string;
    value: string;
  };
  phoneNumber?: string;
  department?: string;
  level?: string;
  created_at?: Date | null;
  updated_at?: Date | null;
}
