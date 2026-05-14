"use client";

import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/features/reports/services/report.service";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2, FileText, Download, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function ReportDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: report, isLoading, isError } = useQuery({
    queryKey: ["reports", id],
    queryFn: () => reportService.getById(id),
    refetchInterval: (data) => (data?.state.data?.status === "Processing" ? 3000 : false),
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Report not found.</p>
        <Link href="/reports">
          <Button variant="outline">Back to Reports</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/reports">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Report Status</h1>
          <p className="text-sm text-muted-foreground">
            {report.title}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                <CardTitle className="text-lg">Generation Details</CardTitle>
              </div>
              <Badge variant={report.status === "Completed" ? "outline" : "secondary"}>
                {report.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Report Type</p>
                <p className="text-sm">{report.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Format</p>
                <p className="text-sm font-medium">{report.format}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Date Range</p>
                <p className="text-sm flex items-center gap-2">
                  <Calendar className="size-3" />
                  {report.date_range.from} - {report.date_range.to}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Generated On</p>
                <p className="text-sm">{new Date(report.created_at).toLocaleString()}</p>
              </div>
            </div>

            <Separator />

            {report.status === "Processing" && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <div className="text-center">
                  <p className="text-sm font-medium">Processing your data...</p>
                  <p className="text-xs text-muted-foreground">This may take a few moments depending on the data size.</p>
                </div>
              </div>
            )}

            {report.status === "Completed" && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-4">
                <CheckCircle2 className="size-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">Ready for Download</p>
                  <p className="text-xs text-primary/80">Your report has been successfully generated and is ready to be exported.</p>
                </div>
              </div>
            )}

            {report.status === "Failed" && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-4">
                <AlertCircle className="size-5 text-destructive mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">Generation Failed</p>
                  <p className="text-xs text-destructive/80">There was an error generating your report. Please try again with different filters.</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/30 flex justify-between items-center px-6 py-4">
             <div className="text-xs text-muted-foreground italic">
               ID: {report.id}
             </div>
             {report.status === "Completed" ? (
                <Button 
                  render={<a href={report.file_url} target="_blank" rel="noopener noreferrer" />}
                >
                   <Download className="mr-2 h-4 w-4" />
                   Download {report.format}
                </Button>
             ) : (
                <Button disabled>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
             )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
