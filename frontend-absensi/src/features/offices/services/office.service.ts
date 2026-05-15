import { AxiosError } from "axios";
import { apiClient } from "@/lib/api/api-client";
import { Office, CreateOfficePayload, UpdateOfficePayload } from "../types/office.type";

type BackendOffice = {
  id: string;
  name: string;
  code: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  allowed_radius_meter: number;
  geofence_enabled: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export type OfficeQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

function mapOffice(office: BackendOffice): Office {
  return {
    id: office.id,
    name: office.name,
    code: office.code,
    address: office.address,
    latitude: office.latitude,
    longitude: office.longitude,
    radius_meter: office.allowed_radius_meter,
    geofence_enabled: office.geofence_enabled,
    status: office.is_active ? "Active" : "Inactive",
    created_at: office.created_at,
    updated_at: office.updated_at,
  };
}

function toBackendPayload(payload: Partial<CreateOfficePayload>) {
  return {
    name: payload.name,
    code: payload.code,
    address: payload.address,
    latitude: payload.latitude,
    longitude: payload.longitude,
    allowed_radius_meter: payload.radius_meter,
    geofence_enabled: payload.geofence_enabled,
    is_active: payload.status ? payload.status === "Active" : undefined,
  };
}

function logOfficeError(error: unknown) {
  if (error instanceof AxiosError) {
    console.error("Failed to fetch offices:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      headers: error.config?.headers,
    });
  } else {
    console.error("Failed to fetch offices:", error);
  }
}

export const officeService = {
  getAll: async (params?: OfficeQueryParams) => {
    try {
      const response = await apiClient.get<BackendPage<BackendOffice>>("/admin/offices", { params });
      return response.data.data.items.map(mapOffice);
    } catch (error) {
      logOfficeError(error);
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await apiClient.get<BackendSingle<BackendOffice>>(`/admin/offices/${id}`);
    return mapOffice(response.data.data);
  },

  create: async (payload: CreateOfficePayload) => {
    const response = await apiClient.post<BackendSingle<BackendOffice>>("/admin/offices", toBackendPayload(payload));
    return mapOffice(response.data.data);
  },

  update: async (id: string, payload: UpdateOfficePayload) => {
    const response = await apiClient.put<BackendSingle<BackendOffice>>(`/admin/offices/${id}`, toBackendPayload(payload));
    return mapOffice(response.data.data);
  },

  delete: async (id: string) => {
    await apiClient.delete(`/admin/offices/${id}`);
  },

  getMyOffice: async () => {
    const response = await apiClient.get<BackendSingle<BackendOffice>>(
      "/app/office"
    );
    return mapOffice(response.data.data);
  },
};
