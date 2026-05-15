"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { useCreateReport } from "@/features/reports/hooks/use-create-report";
import { useOffices } from "@/features/offices/hooks/use-offices";

const reportSchema = z.object({
  type: z.string(),
  date_from: z.string().min(1, "Start date is required"),
  date_to: z.string().min(1, "End date is required"),
  office_id: z.string().optional(),
  format: z.enum(["PDF", "XLSX", "CSV"]),
});

type ReportFormValues = z.infer<typeof reportSchema>;

function CreateReportContent() {
  const searchParams = useSearchParams();
  const reportType = searchParams.get("type") || "Daily";
  const createMutation = useCreateReport();
  const { data: offices = [] } = useOffices({ limit: 100 });

  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: reportType,
      date_from: new Date().toISOString().split('T')[0],
      date_to: new Date().toISOString().split('T')[0],
      office_id: "all",
      format: "PDF" as const,
    },
  });

  const onSubmit = (data: ReportFormValues) => {
    createMutation.mutate({
      type: data.type as "Daily" | "Monthly" | "Late" | "Summary",
      date_range: {
        from: data.date_from,
        to: data.date_to,
      },
      office_id: data.office_id === "all" ? undefined : data.office_id,
      format: data.format,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/reports">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Generate Report</h1>
          <p className="text-sm text-muted-foreground">
            Configure filters and format for your {reportType} report.
          </p>
        </div>
      </div>

      <div className="max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <input 
                        type="date" 
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <input 
                        type="date" 
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="office_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Filter</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Offices" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Offices</SelectItem>
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
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Export Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PDF">PDF Document</SelectItem>
                      <SelectItem value="XLSX">Excel Spreadsheet</SelectItem>
                      <SelectItem value="CSV">CSV Text File</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/admin/reports">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                Generate Report
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function CreateReportPage() {
  return (
    <Suspense fallback={null}>
      <CreateReportContent />
    </Suspense>
  );
}
