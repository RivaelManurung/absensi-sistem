export type EmployeeRole = "admin" | "hr" | "employee";
export type EmployeeStatus = "Active" | "Inactive";

export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  phone?: string;
  office_id: string;
  office_name?: string;
  position: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeePayload {
  employee_id: string;
  name: string;
  email: string;
  phone?: string;
  office_id: string;
  position: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  password?: string;
}

export interface UpdateEmployeePayload extends Partial<CreateEmployeePayload> {}
