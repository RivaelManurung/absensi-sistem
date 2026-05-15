"use client";

import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { officeSchema, type OfficeFormValues } from "../schemas/office.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Office } from "../types/office.type";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { OfficeLocationFormSection } from "./office-location-form-section";

interface OfficeFormProps {
  initialData?: Office;
  onSubmit: (data: OfficeFormValues) => void;
  isLoading?: boolean;
}

export function OfficeForm({ initialData, onSubmit, isLoading }: OfficeFormProps) {
  const form = useForm<OfficeFormValues>({
    resolver: zodResolver(officeSchema) as unknown as Resolver<OfficeFormValues>,
    defaultValues: {
      name: "",
      code: "",
      address: "",
      latitude: null,
      longitude: null,
      radius_meter: 100,
      geofence_enabled: true,
      status: "Active",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        code: initialData.code,
        address: initialData.address,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        radius_meter: initialData.radius_meter,
        geofence_enabled: initialData.geofence_enabled,
        status: initialData.status,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit: SubmitHandler<OfficeFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField<OfficeFormValues, "name">
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Headquarters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<OfficeFormValues, "code">
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Code</FormLabel>
                  <FormControl>
                    <Input placeholder="HQ-JKT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField<OfficeFormValues, "address">
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Jl. Sudirman No. 1, Jakarta" 
                    className="resize-none min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<OfficeFormValues, "status">
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="max-w-[200px]">
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-8">
          <OfficeLocationFormSection />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => window.history.back()} className="rounded-xl px-6">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="rounded-xl px-8 shadow-md">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Office" : "Create Office"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
