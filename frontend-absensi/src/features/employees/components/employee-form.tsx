"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, type EmployeeFormValues } from "../schemas/employee.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "../types/employee.type";
import { useEffect } from "react";
import { Loader2, User, Briefcase, Shield, Info, Phone, Calendar, MapPin, Mail, Lock } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { useOffices } from "@/features/offices/hooks/use-offices";
import { useShifts } from "@/features/shifts/hooks/use-shifts";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface EmployeeFormProps {
  initialData?: Employee;
  onSubmit: (data: EmployeeFormValues) => void;
  isLoading?: boolean;
}

export function EmployeeForm({ initialData, onSubmit, isLoading }: EmployeeFormProps) {
  const { data: offices = [], isLoading: isLoadingOffices } = useOffices({ limit: 100 });
  const { data: shifts = [], isLoading: isLoadingShifts } = useShifts({ limit: 100 });

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employee_code: "",
      full_name: "",
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      gender: "Male",
      birth_date: "",
      address: "",
      avatar_url: "",
      office_id: "",
      shift_id: "",
      position: "",
      department: "",
      join_date: new Date().toISOString().split('T')[0],
      employment_status: "Full-time",
      emergency_contact: "",
      emergency_phone: "",
      notes: "",
      role: "employee",
      is_active: true,
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        employee_code: initialData.employee_code,
        full_name: initialData.full_name,
        first_name: initialData.user?.first_name || "",
        last_name: initialData.user?.last_name || "",
        username: initialData.user?.username || "",
        email: initialData.email,
        phone: initialData.phone || "",
        gender: initialData.user?.gender || "Male",
        birth_date: initialData.user?.birth_date ? new Date(initialData.user.birth_date).toISOString().split('T')[0] : "",
        address: initialData.user?.address || "",
        avatar_url: initialData.user?.avatar_url || "",
        office_id: initialData.office_id,
        shift_id: initialData.shift_id,
        position: initialData.position,
        department: initialData.department || "",
        join_date: initialData.join_date ? new Date(initialData.join_date).toISOString().split('T')[0] : "",
        employment_status: initialData.employment_status || "Full-time",
        emergency_contact: initialData.emergency_contact || "",
        emergency_phone: initialData.emergency_phone || "",
        notes: initialData.notes || "",
        role: initialData.user?.role || "employee",
        is_active: initialData.is_active,
        password: "",
        password_confirmation: "",
      });
    }
  }, [initialData, form]);

  const handleFormSubmit: SubmitHandler<EmployeeFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-12">
        
        {/* Section 1: Personal Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            <h2 className="text-lg font-bold tracking-tight">Personal Information</h2>
          </div>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" className="rounded-xl h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" className="rounded-xl h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="rounded-xl h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" className="rounded-xl h-11" {...field} />
                  </FormControl>
                  <FormDescription>Unique name for login and profile.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input type="email" placeholder="john.doe@company.com" className="rounded-xl h-11 pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="+62812345678" className="rounded-xl h-11 pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                        <Input type="date" className="rounded-xl h-11 pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Textarea placeholder="Enter full address" className="rounded-xl min-h-[100px] pl-10 pt-2.5" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {/* Section 2: Employment Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Briefcase className="h-5 w-5" />
            <h2 className="text-lg font-bold tracking-tight">Employment Information</h2>
          </div>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="employee_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID *</FormLabel>
                  <FormControl>
                    <Input placeholder="EMP001" className="rounded-xl h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Position *</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" className="rounded-xl h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering" className="rounded-xl h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="office_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Office *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder={isLoadingOffices ? "Loading offices..." : "Select an office"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      {offices.map((office) => (
                        <SelectItem key={office.id} value={office.id}>
                          {office.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shift_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Shift *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder={isLoadingShifts ? "Loading shifts..." : "Select a shift"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      {shifts.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shift.name} ({shift.start_time} - {shift.end_time})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="join_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Date</FormLabel>
                  <FormControl>
                    <Input type="date" className="rounded-xl h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Probation">Probation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Status</FormLabel>
                  <Select onValueChange={(val) => field.onChange(val === "true")} defaultValue={field.value ? "true" : "false"} value={field.value ? "true" : "false"}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section 3: Emergency & Notes */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Info className="h-5 w-5" />
            <h2 className="text-lg font-bold tracking-tight">Additional Information</h2>
          </div>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="emergency_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of family/friend" className="rounded-xl h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergency_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+62..." className="rounded-xl h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any relevant notes about this employee..." className="rounded-xl min-h-[100px] pt-2.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {/* Section 4: Account & Security */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            <h2 className="text-lg font-bold tracking-tight">Account & Security</h2>
          </div>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Role *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11 ring-2 ring-primary/5">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="admin">System Admin</SelectItem>
                      <SelectItem value="hr">HR Manager</SelectItem>
                      <SelectItem value="employee">Standard Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Determines permissions and access levels.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{initialData ? "Change Password" : "Account Password *"}</FormLabel>
                  <FormControl>
                    <PasswordInput 
                      placeholder="••••••••" 
                      className="rounded-xl h-11" 
                      leftIcon={<Lock className="h-5 w-5" />}
                      autoComplete={initialData ? "new-password" : "current-password"}
                      {...field} 
                    />
                  </FormControl>
                  {initialData && <FormDescription>Leave empty to keep current password.</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput 
                      placeholder="••••••••" 
                      className="rounded-xl h-11" 
                      leftIcon={<Lock className="h-5 w-5" />}
                      autoComplete={initialData ? "new-password" : "current-password"}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-4 pt-6">
          <Button type="button" variant="ghost" size="lg" className="rounded-xl px-8 order-2 md:order-1" onClick={() => window.history.back()}>
            Discard Changes
          </Button>
          <Button type="submit" size="lg" className="rounded-xl px-12 shadow-lg shadow-primary/20 order-1 md:order-2" disabled={isLoading || isLoadingOffices || isLoadingShifts}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Shield className="mr-2 h-5 w-5" />}
            {initialData ? "Save Employee Changes" : "Register Employee"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
