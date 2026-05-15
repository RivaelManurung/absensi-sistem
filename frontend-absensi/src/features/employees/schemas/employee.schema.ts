import * as z from "zod";

export const employeeSchema = z.object({
  employee_code: z.string().min(1, "Employee ID is required"),
  full_name: z.string().min(1, "Full name is required"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  birth_date: z.string().optional(),
  address: z.string().optional(),
  avatar_url: z.string().optional(),
  office_id: z.string().min(1, "Office is required"),
  shift_id: z.string().min(1, "Shift is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().optional(),
  join_date: z.string().optional(),
  employment_status: z.enum(["Full-time", "Part-time", "Contract", "Probation"]).optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
  notes: z.string().optional(),
  role: z.enum(["admin", "hr", "employee"], {
    message: "Role is required",
  }),
  is_active: z.boolean().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  password_confirmation: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.password && data.password !== data.password_confirmation) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export const profileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  birth_date: z.string().optional(),
  address: z.string().optional(),
  avatar_url: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  password_confirmation: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.password && data.password !== data.password_confirmation) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
