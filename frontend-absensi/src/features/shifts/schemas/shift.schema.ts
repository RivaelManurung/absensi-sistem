import { z } from "zod"

export const shiftSchema = z.object({
  name: z.string().min(1, "Shift name is required"),
  code: z.string().min(1, "Shift code is required"),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  late_tolerance_minutes: z.coerce
    .number({ message: "Late tolerance must be a valid number" })
    .min(0, "Tolerance cannot be negative"),
  break_duration_minutes: z.coerce
    .number({ message: "Break duration must be a valid number" })
    .min(0, "Duration cannot be negative"),
  status: z.enum(["Active", "Inactive"]),
})

export type ShiftFormValues = z.infer<typeof shiftSchema>
