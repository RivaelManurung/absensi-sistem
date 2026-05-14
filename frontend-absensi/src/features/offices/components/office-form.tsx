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
      latitude: 0,
      longitude: 0,
      radius_meter: 100,
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
        status: initialData.status,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit: SubmitHandler<OfficeFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField<OfficeFormValues, "latitude">
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="any" 
                    placeholder="-6.2088" 
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<OfficeFormValues, "longitude">
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="any" 
                    placeholder="106.8456" 
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<OfficeFormValues, "radius_meter">
            control={form.control}
            name="radius_meter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geofence Radius (meters)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="100" 
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Office" : "Create Office"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
