import apiClient from "@/lib/api-client";
import { Report, CreateReportPayload } from "../types/report.type";

export const reportService = {
  getAll: async () => {
    const response = await apiClient.get<Report[]>("/reports");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Report>(`/reports/${id}`);
    return response.data;
  },

  create: async (payload: CreateReportPayload) => {
    const response = await apiClient.post<Report>("/reports", payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/reports/${id}`);
    return response.data;
  },
};
