import { apiClient } from "@/lib/api/api-client";
import {
  CreateEmployeePayload,
  Employee,
  EmployeeRole,
  ProfileUpdatePayload,
  UpdateEmployeePayload,
} from "../types/employee.type";

type BackendUser = {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email: string;
  role: EmployeeRole;
  avatar_url?: string;
  gender?: string;
  birth_date?: string;
  address?: string;
  is_active: boolean;
};

type BackendOffice = {
  id: string;
  name: string;
};

type BackendShift = {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
};

type BackendEmployee = {
  id: string;
  employee_code: string;
  full_name: string;
  phone?: string;
  position: string;
  department?: string;
  office_id: string;
  office?: BackendOffice;
  shift_id: string;
  shift?: BackendShift;
  join_date?: string;
  employment_status?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: BackendUser;
};

type BackendPage<T> = {
  success: boolean;
  message: string;
  data: {
    items: T[];
    meta: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
};

type BackendSingle<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type EmployeePage = {
  items: Employee[];
  meta: BackendPage<BackendEmployee>["data"]["meta"];
};

function mapEmployee(employee: BackendEmployee): Employee {
  return {
    ...employee,
    id: employee.id,
    email: employee.user?.email ?? "",
    status: employee.is_active ? "Active" : "Inactive",
    user: employee.user ? {
        ...employee.user,
        gender: employee.user.gender as any,
    } : undefined,
    employment_status: employee.employment_status as any,
  } as Employee;
}

export const employeeService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await apiClient.get<BackendPage<BackendEmployee>>(
      "/admin/employees",
      { params }
    );

    return {
      items: response.data.data.items.map(mapEmployee),
      meta: response.data.data.meta,
    };
  },

  getById: async (id: string) => {
    const response = await apiClient.get<BackendSingle<BackendEmployee>>(
      `/admin/employees/${id}`
    );
    return mapEmployee(response.data.data);
  },

  create: async (payload: CreateEmployeePayload) => {
    const response = await apiClient.post<BackendSingle<BackendEmployee>>(
      "/admin/employees",
      payload
    );
    return mapEmployee(response.data.data);
  },

  update: async (id: string, payload: UpdateEmployeePayload) => {
    const response = await apiClient.put<BackendSingle<BackendEmployee>>(
      `/admin/employees/${id}`,
      payload
    );
    return mapEmployee(response.data.data);
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/employees/${id}`);
    return response.data;
  },

  // Self Profile Management
  getMe: async () => {
    const response = await apiClient.get<BackendSingle<BackendEmployee>>("/app/me");
    return mapEmployee(response.data.data);
  },

  updateProfile: async (payload: ProfileUpdatePayload) => {
    const response = await apiClient.put<BackendSingle<BackendEmployee>>(
      "/app/profile",
      payload
    );
    return mapEmployee(response.data.data);
  },
};
