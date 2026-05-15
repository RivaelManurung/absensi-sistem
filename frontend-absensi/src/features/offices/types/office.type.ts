export type OfficeStatus = "Active" | "Inactive";

export interface Office {
  id: string;
  name: string;
  code: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  radius_meter: number;
  geofence_enabled: boolean;
  status: OfficeStatus;
  total_employees?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOfficePayload {
  name: string;
  code: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  radius_meter: number;
  geofence_enabled: boolean;
  status: OfficeStatus;
}

export type UpdateOfficePayload = Partial<CreateOfficePayload>;
