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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, FileText, Download } from "lucide-react";
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
    <div className="w-full space-y-8 px-6 py-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-6 rounded-3xl border bg-card p-8 shadow-sm md:flex-row md:items-center md:justify-between lg:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
              <FileText className="h-12 w-12" />
            </div>
            <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-background bg-primary text-primary-foreground shadow-lg">
                <Download className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Generate Report
              </h1>
            </div>

            <p className="text-sm font-medium text-muted-foreground max-w-lg">
              Konfigurasi parameter laporan {reportType} untuk diunduh dalam format pilihan Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:self-start">
          <Link href="/admin/reports">
            <Button variant="outline" size="lg" className="rounded-xl px-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
          <CardHeader className="bg-muted/30 px-8 py-6">
            <CardTitle className="text-xl">Report Configuration</CardTitle>
            <CardDescription>
              Tentukan rentang tanggal dan filter kantor untuk data laporan.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 lg:p-10">
            <div className="mx-auto max-w-4xl">
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
                              className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                              className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                            <SelectTrigger className="rounded-xl h-11">
                              <SelectValue placeholder="All Offices" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
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
                            <SelectTrigger className="rounded-xl h-11">
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="PDF">PDF Document</SelectItem>
                            <SelectItem value="XLSX">Excel Spreadsheet</SelectItem>
                            <SelectItem value="CSV">CSV Text File</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-6">
                    <Button type="submit" size="lg" className="rounded-xl px-8 w-full md:w-auto" disabled={createMutation.isPending}>
                      {createMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      Generate & Download
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
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
