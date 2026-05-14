import { z } from "zod"

export const officeSchema = z.object({
  name: z.string().min(1, "Office name is required"),
  code: z.string().min(1, "Office code is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.coerce
    .number({ message: "Latitude must be a valid number" })
    .min(-90, "Latitude must be greater than or equal to -90")
    .max(90, "Latitude must be less than or equal to 90"),
  longitude: z.coerce
    .number({ message: "Longitude must be a valid number" })
    .min(-180, "Longitude must be greater than or equal to -180")
    .max(180, "Longitude must be less than or equal to 180"),
  radius_meter: z.coerce
    .number({ message: "Radius must be a valid number" })
    .min(10, "Radius must be at least 10 meters"),
  status: z.enum(["Active", "Inactive"]),
})

export type OfficeFormValues = z.infer<typeof officeSchema>
