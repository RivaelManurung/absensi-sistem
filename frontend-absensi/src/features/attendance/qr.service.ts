import { apiClient } from '@/lib/api/api-client';
import { 
  QRResponse, 
  QRAttendanceRequest, 
  ScanEmployeeQRRequest, 
  GenerateOfficeQRRequest 
} from '@/types/qr';
import { ApiResponse } from '@/types/api';

export const qrService = {
  // Mode B: Employee scan office QR
  checkIn: async (payload: QRAttendanceRequest): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.post<ApiResponse<unknown>>('/attendance/qr/check-in', payload);
    return data;
  },

  checkOut: async (payload: QRAttendanceRequest): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.post<ApiResponse<unknown>>('/attendance/qr/check-out', payload);
    return data;
  },

  // Mode A: Admin/Security scan employee QR
  scanEmployee: async (payload: ScanEmployeeQRRequest): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.post<ApiResponse<unknown>>('/admin/attendance/qr/scan-employee', payload);
    return data;
  },

  // QR Management
  generateOfficeQR: async (officeId: string, payload: GenerateOfficeQRRequest): Promise<QRResponse> => {
    const { data } = await apiClient.post<ApiResponse<QRResponse>>(`/admin/offices/${officeId}/qr-sessions`, payload);
    return data.data;
  },

  getEmployeeQR: async (employeeId: string): Promise<QRResponse> => {
    const { data } = await apiClient.get<ApiResponse<QRResponse>>(`/admin/employees/${employeeId}/qr`);
    return data.data;
  },

  regenerateEmployeeQR: async (employeeId: string): Promise<QRResponse> => {
    const { data } = await apiClient.post<ApiResponse<QRResponse>>(`/admin/employees/${employeeId}/qr/regenerate`);
    return data.data;
  },
};
