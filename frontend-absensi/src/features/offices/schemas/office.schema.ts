import { z } from "zod"

export const officeSchema = z.object({
  name: z.string().min(1, "Office name is required"),
  code: z.string().min(1, "Office code is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.preprocess(
    (val) => (val === "" || val === undefined ? null : val),
    z.coerce.number().min(-90).max(90).nullable()
  ),
  longitude: z.preprocess(
    (val) => (val === "" || val === undefined ? null : val),
    z.coerce.number().min(-180).max(180).nullable()
  ),
  radius_meter: z.coerce
    .number({ message: "Radius must be a valid number" })
    .min(10, "Radius must be at least 10 meters")
    .max(5000, "Radius cannot exceed 5000 meters"),
  geofence_enabled: z.boolean().default(true),
  status: z.enum(["Active", "Inactive"]),
}).refine((data) => {
  if (data.geofence_enabled) {
    return data.latitude !== null && data.longitude !== null;
  }
  return true;
}, {
  message: "Coordinates are required when geofence is enabled",
  path: ["latitude"],
});

export type OfficeFormValues = z.infer<typeof officeSchema>
