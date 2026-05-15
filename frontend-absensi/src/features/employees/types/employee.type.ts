export type EmployeeRole = "admin" | "hr" | "employee";
export type EmployeeStatus = "Active" | "Inactive";
export type EmploymentStatus = "Full-time" | "Part-time" | "Contract" | "Probation";
export type Gender = "Male" | "Female" | "Other";

export interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  office_id: string;
  office?: {
    id: string;
    name: string;
    code: string;
  };
  shift_id: string;
  shift?: {
    id: string;
    name: string;
    code: string;
    start_time: string;
    end_time: string;
  };
  join_date?: string;
  employment_status?: EmploymentStatus;
  emergency_contact?: string;
  emergency_phone?: string;
  notes?: string;
  is_active: boolean;
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    role: EmployeeRole;
    is_active: boolean;
    first_name?: string;
    last_name?: string;
    username?: string;
    avatar_url?: string;
    gender?: Gender;
    birth_date?: string;
    address?: string;
  };
}

export interface CreateEmployeePayload {
  employee_code: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email: string;
  phone?: string;
  gender?: Gender;
  birth_date?: string;
  address?: string;
  avatar_url?: string;
  office_id: string;
  shift_id: string;
  position: string;
  department?: string;
  join_date?: string;
  employment_status?: EmploymentStatus;
  emergency_contact?: string;
  emergency_phone?: string;
  notes?: string;
  role: EmployeeRole;
  is_active?: boolean;
  password?: string;
}

export interface UpdateEmployeePayload extends Partial<CreateEmployeePayload> {}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  username?: string;
  email: string;
  phone?: string;
  gender?: Gender;
  birth_date?: string;
  address?: string;
  avatar_url?: string;
  password?: string;
}
