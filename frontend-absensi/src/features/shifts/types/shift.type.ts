export type ShiftStatus = "Active" | "Inactive";

export interface Shift {
  id: string;
  name: string;
  code: string;
  start_time: string; // HH:mm
  end_time: string;   // HH:mm
  late_tolerance_minutes: number;
  break_duration_minutes: number;
  status: ShiftStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateShiftPayload {
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  late_tolerance_minutes: number;
  break_duration_minutes: number;
  status: ShiftStatus;
}

export type UpdateShiftPayload = Partial<CreateShiftPayload>;
