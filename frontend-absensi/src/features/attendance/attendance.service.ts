import { apiClient } from '@/lib/api/api-client';

export interface LocationPayload {
  latitude: number;
  longitude: number;
}

export interface AttendanceData {
  id: string;
  employee_id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: string;
  check_in_location: {
    lat: number;
    lng: number;
  } | null;
}

export interface SingleResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ListResponse<T> {
  code: number;
  message: string;
  data: T[];
}

export const attendanceService = {
  checkIn: async (payload: LocationPayload): Promise<SingleResponse<AttendanceData>> => {
    const { data } = await apiClient.post('/attendance/check-in', payload);
    return data;
  },

  checkOut: async (payload: LocationPayload): Promise<SingleResponse<AttendanceData>> => {
    const { data } = await apiClient.post('/attendance/check-out', payload);
    return data;
  },

  getToday: async (): Promise<SingleResponse<AttendanceData | null>> => {
    const { data } = await apiClient.get('/attendance/today');
    return data;
  },

  getHistory: async (): Promise<ListResponse<AttendanceData>> => {
    const { data } = await apiClient.get('/attendance/history');
    return data;
  }
};
