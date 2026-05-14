"use client";

import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shiftSchema, type ShiftFormValues } from "../schemas/shift.schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shift } from "../types/shift.type";
import { useEffect } from "react";
import { Loader2, Clock } from "lucide-react";

interface ShiftFormProps {
  initialData?: Shift;
  onSubmit: (data: ShiftFormValues) => void;
  isLoading?: boolean;
}

export function ShiftForm({ initialData, onSubmit, isLoading }: ShiftFormProps) {
  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema) as unknown as Resolver<ShiftFormValues>,
    defaultValues: {
      name: "",
      code: "",
      start_time: "08:00",
      end_time: "17:00",
      late_tolerance_minutes: 15,
      break_duration_minutes: 60,
      status: "Active",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        code: initialData.code,
        start_time: initialData.start_time,
        end_time: initialData.end_time,
        late_tolerance_minutes: initialData.late_tolerance_minutes,
        break_duration_minutes: initialData.break_duration_minutes,
        status: initialData.status,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit: SubmitHandler<ShiftFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<ShiftFormValues, "name">
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift Name</FormLabel>
                <FormControl>
                  <Input placeholder="Regular Morning" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<ShiftFormValues, "code">
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift Code</FormLabel>
                <FormControl>
                  <Input placeholder="REG-MOR" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<ShiftFormValues, "start_time">
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="time" {...field} />
                    <Clock className="absolute right-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<ShiftFormValues, "end_time">
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="time" {...field} />
                    <Clock className="absolute right-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<ShiftFormValues, "late_tolerance_minutes">
            control={form.control}
            name="late_tolerance_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Late Tolerance (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<ShiftFormValues, "break_duration_minutes">
            control={form.control}
            name="break_duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Break Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
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

        <FormField<ShiftFormValues, "status">
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
            {initialData ? "Update Shift" : "Create Shift"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
