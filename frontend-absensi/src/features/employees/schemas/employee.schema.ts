import * as z from "zod";

export const employeeSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  office_id: z.string().min(1, "Office is required"),
  position: z.string().min(1, "Position is required"),
  role: z.enum(["admin", "hr", "employee"], {
    message: "Role is required",
  }),
  status: z.enum(["Active", "Inactive"], {
    message: "Status is required",
  }),
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

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
