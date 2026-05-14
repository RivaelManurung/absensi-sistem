export type OfficeStatus = "Active" | "Inactive";

export interface Office {
  id: string;
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  radius_meter: number;
  status: OfficeStatus;
  total_employees?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOfficePayload {
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  radius_meter: number;
  status: OfficeStatus;
}

export interface UpdateOfficePayload extends Partial<CreateOfficePayload> {}
