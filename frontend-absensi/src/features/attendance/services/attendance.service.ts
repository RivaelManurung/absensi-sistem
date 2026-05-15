import { apiClient } from "@/lib/api/api-client";
import { AttendanceRecord, AttendanceStatus } from "../types/attendance.type";

export type LocationPayload = {
  latitude: number;
  longitude: number;
  accuracy: number;
  device_id?: string;
  notes?: string;
};

type BackendAttendance = {
  id: string;
  employee_id: string;
  office_id: string;
  attendance_date: string;
  check_in_at: string | null;
  check_out_at: string | null;
  check_in_latitude: number | null;
  check_in_longitude: number | null;
  check_in_accuracy: number | null;
  check_in_distance_meter: number | null;
  status: string;
  late_minutes: number;
  notes?: string;
  employee?: {
    full_name?: string;
    office?: {
      name?: string;
    };
  };
};

type BackendSingle<T> = {
  success: boolean;
  message: string;
  data: T;
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

export type AttendancePage = {
  items: AttendanceRecord[];
  meta: BackendPage<BackendAttendance>["data"]["meta"];
};

function formatTime(value: string | null) {
  if (!value) return undefined;
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapStatus(status: string): AttendanceStatus {
  if (status === "late") return "Late";
  if (status === "absent") return "Absent";
  if (status === "present" || status === "checked_in" || status === "checked_out") {
    return "Present";
  }
  return "Present";
}

function mapAttendance(item: BackendAttendance): AttendanceRecord {
  return {
    id: item.id,
    employee_id: item.employee_id,
    employee_name: item.employee?.full_name ?? "Employee",
    office_id: item.office_id,
    office_name: item.employee?.office?.name ?? "-",
    date: item.attendance_date,
    check_in: formatTime(item.check_in_at),
    check_out: formatTime(item.check_out_at),
    status: mapStatus(item.status),
    location_status: item.check_in_distance_meter != null ? "Inside Geofence" : undefined,
    latitude: item.check_in_latitude ?? undefined,
    longitude: item.check_in_longitude ?? undefined,
    distance_from_office: item.check_in_distance_meter ?? undefined,
    created_at: item.check_in_at ?? item.attendance_date,
  };
}

export const attendanceService = {
  getHistory: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await apiClient.get<BackendPage<BackendAttendance>>(
      "/attendance/history",
      { params }
    );
    return {
      items: response.data.data.items.map(mapAttendance),
      meta: response.data.data.meta,
    };
  },

  getById: async (id: string) => {
    const history = await attendanceService.getHistory({ limit: 100 });
    return history.items.find((item) => item.id === id) ?? null;
  },

  getToday: async () => {
    const response = await apiClient.get<BackendSingle<BackendAttendance>>(
      "/attendance/today"
    );
    return mapAttendance(response.data.data);
  },

  checkIn: async (payload: LocationPayload) => {
    const response = await apiClient.post<BackendSingle<BackendAttendance>>(
      "/attendance/check-in",
      {
        ...payload,
        device_id: payload.device_id ?? "web-browser",
      }
    );
    return mapAttendance(response.data.data);
  },

  checkOut: async (payload: LocationPayload) => {
    const response = await apiClient.post<BackendSingle<BackendAttendance>>(
      "/attendance/check-out",
      payload
    );
    return mapAttendance(response.data.data);
  },

  scanAttendance: async (payload: { qr_code: string } & LocationPayload) => {
    const response = await apiClient.post<BackendSingle<{ employee_name: string; type: string; attendance: BackendAttendance }>>(
      "/attendance/scan",
      {
        ...payload,
        device_id: payload.device_id ?? "unified-scanner",
      }
    );
    return {
      success: response.data.success,
      message: response.data.message,
      employeeName: response.data.data.employee_name,
      type: response.data.data.type,
      attendance: mapAttendance(response.data.data.attendance),
    };
  },
};
