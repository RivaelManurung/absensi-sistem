import { apiClient } from "@/lib/api/api-client";
import {
  CreateEmployeePayload,
  Employee,
  EmployeeRole,
  UpdateEmployeePayload,
} from "../types/employee.type";

type BackendUser = {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  is_active: boolean;
};

type BackendOffice = {
  id: string;
  name: string;
};

type BackendShift = {
  id: string;
  name: string;
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
    id: employee.id,
    employee_id: employee.employee_code,
    name: employee.full_name,
    email: employee.user?.email ?? "",
    phone: employee.phone,
    office_id: employee.office_id,
    office_name: employee.office?.name,
    shift_id: employee.shift_id,
    shift_name: employee.shift?.name,
    position: employee.position,
    department: employee.department,
    role: employee.user?.role ?? "employee",
    status: employee.is_active ? "Active" : "Inactive",
    created_at: employee.created_at,
    updated_at: employee.updated_at,
  };
}

function toBackendPayload(payload: CreateEmployeePayload | UpdateEmployeePayload) {
  return {
    full_name: payload.name,
    name: payload.name,
    employee_code: payload.employee_id,
    email: payload.email,
    phone: payload.phone,
    office_id: payload.office_id,
    shift_id: payload.shift_id,
    position: payload.position,
    department: payload.department,
    role: payload.role,
    password: payload.password,
    is_active: payload.status ? payload.status === "Active" : undefined,
  };
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
      toBackendPayload(payload)
    );
    return mapEmployee(response.data.data);
  },

  update: async (id: string, payload: UpdateEmployeePayload) => {
    const response = await apiClient.put<BackendSingle<BackendEmployee>>(
      `/admin/employees/${id}`,
      toBackendPayload(payload)
    );
    return mapEmployee(response.data.data);
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/employees/${id}`);
    return response.data;
  },
};
