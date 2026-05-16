"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "../schemas/employee.schema";
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
import { Loader2, User, Phone, Calendar, MapPin, Mail, Lock, Shield } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface ProfileFormProps {
  initialData?: Employee;
  onSubmit: (data: ProfileFormValues) => void;
  isLoading?: boolean;
}

export function ProfileForm({ initialData, onSubmit, isLoading }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      gender: "Male",
      birth_date: "",
      address: "",
      avatar_url: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        first_name: initialData.user?.first_name || "",
        last_name: initialData.user?.last_name || "",
        username: initialData.user?.username || "",
        email: initialData.email,
        phone: initialData.phone || "",
        gender: initialData.user?.gender || "Male",
        birth_date: initialData.user?.birth_date ? new Date(initialData.user.birth_date).toISOString().split('T')[0] : "",
        address: initialData.user?.address || "",
        avatar_url: initialData.user?.avatar_url || "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [initialData, form]);

  const handleFormSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-10">
        
        {/* Section 1: Personal Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            <h2 className="text-lg font-bold tracking-tight">Personal Details</h2>
          </div>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" className="rounded-xl h-11" {...field} />
                  </FormControl>
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
                  <FormLabel>Current Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Textarea placeholder="Enter your full address" className="rounded-xl min-h-[100px] pl-10 pt-2.5" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {/* Section 2: Security */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            <h2 className="text-lg font-bold tracking-tight">Security & Password</h2>
          </div>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput 
                      placeholder="••••••••" 
                      className="rounded-xl h-11" 
                      leftIcon={<Lock className="h-5 w-5" />}
                      autoComplete="new-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Leave empty if you don't want to change it.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordInput 
                      placeholder="••••••••" 
                      className="rounded-xl h-11" 
                      leftIcon={<Lock className="h-5 w-5" />}
                      autoComplete="new-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button type="submit" size="lg" className="rounded-xl px-12 shadow-lg shadow-primary/20" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Save Profile Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
