export type AttendanceStatus = "Present" | "Late" | "Absent" | "On Leave" | "Holiday";
export type LocationStatus = "Inside Geofence" | "Outside Geofence";

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  office_id: string;
  office_name: string;
  date: string;
  check_in?: string;
  check_out?: string;
  work_duration?: string;
  status: AttendanceStatus;
  location_status?: LocationStatus;
  latitude?: number;
  longitude?: number;
  distance_from_office?: number;
  device_info?: string;
  photo_url?: string;
  created_at: string;
}
