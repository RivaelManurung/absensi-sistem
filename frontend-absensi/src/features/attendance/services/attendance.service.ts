import apiClient from "@/lib/api-client";
import { AttendanceRecord } from "../types/attendance.type";

export const attendanceService = {
  getHistory: async (params?: any) => {
    const response = await apiClient.get<AttendanceRecord[]>("/attendance/history", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<AttendanceRecord>(`/attendance/history/${id}`);
    return response.data;
  },

  checkIn: async (payload: any) => {
    const response = await apiClient.post("/attendance/check-in", payload);
    return response.data;
  },

  checkOut: async (payload: any) => {
    const response = await apiClient.post("/attendance/check-out", payload);
    return response.data;
  },
};
