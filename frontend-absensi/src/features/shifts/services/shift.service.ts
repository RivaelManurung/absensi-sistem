import { AxiosError } from "axios";
import { apiClient } from "@/lib/api/api-client";
import { Shift, CreateShiftPayload, UpdateShiftPayload } from "../types/shift.type";

type BackendShift = {
  id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  late_tolerance_minutes: number;
  break_duration_minutes: number;
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

function mapShift(shift: BackendShift): Shift {
  return {
    id: shift.id,
    name: shift.name,
    code: shift.code,
    start_time: shift.start_time,
    end_time: shift.end_time,
    late_tolerance_minutes: shift.late_tolerance_minutes,
    break_duration_minutes: shift.break_duration_minutes,
    status: shift.is_active ? "Active" : "Inactive",
    created_at: shift.created_at,
    updated_at: shift.updated_at,
  };
}

function toBackendPayload(payload: Partial<CreateShiftPayload>) {
  return {
    name: payload.name,
    code: payload.code,
    start_time: payload.start_time,
    end_time: payload.end_time,
    check_in_start: payload.start_time,
    check_in_end: payload.start_time,
    check_out_start: payload.end_time,
    check_out_end: payload.end_time,
    late_tolerance_minutes: payload.late_tolerance_minutes,
    break_duration_minutes: payload.break_duration_minutes,
    is_active: payload.status ? payload.status === "Active" : undefined,
  };
}

function logShiftError(error: unknown) {
  if (error instanceof AxiosError) {
    console.error("Failed to fetch shifts:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      headers: error.config?.headers,
    });
  } else {
    console.error("Failed to fetch shifts:", error);
  }
}

export const shiftService = {
  getAll: async (params?: any) => {
    try {
      const response = await apiClient.get<BackendPage<BackendShift>>("/admin/shifts", { params });
      return response.data.data.items.map(mapShift);
    } catch (error) {
      logShiftError(error);
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await apiClient.get<BackendSingle<BackendShift>>(`/admin/shifts/${id}`);
    return mapShift(response.data.data);
  },

  create: async (payload: CreateShiftPayload) => {
    const response = await apiClient.post<BackendSingle<BackendShift>>("/admin/shifts", toBackendPayload(payload));
    return mapShift(response.data.data);
  },

  update: async (id: string, payload: UpdateShiftPayload) => {
    const response = await apiClient.put<BackendSingle<BackendShift>>(`/admin/shifts/${id}`, toBackendPayload(payload));
    return mapShift(response.data.data);
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/shifts/${id}`);
    return response.data;
  },
};
