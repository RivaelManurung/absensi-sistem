export interface QRResponse {
  employee_id?: string;
  employee_code?: string;
  session_id?: string;
  office_id?: string;
  purpose?: string;
  expires_at?: string;
  qr_token: string;
  qr_image_data_url: string;
  status?: string;
  created_at?: string;
}

export interface QRAttendanceRequest {
  qr_token: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  device_id: string;
}

export interface ScanEmployeeQRRequest {
  employee_qr_token: string;
  action: 'check_in' | 'check_out';
  latitude: number;
  longitude: number;
  accuracy: number;
  device_id: string;
}

export interface GenerateOfficeQRRequest {
  purpose: 'check_in' | 'check_out' | 'both';
  ttl_seconds: number;
  shift_id?: string;
}
