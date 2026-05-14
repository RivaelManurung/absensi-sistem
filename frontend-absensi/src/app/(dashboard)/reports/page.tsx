"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plus, 
  Calendar, 
  Clock, 
  ChevronRight,
  Download,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useReports } from "@/features/reports/hooks/use-reports";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const { data: reports, isLoading, isError } = useReports();

  const reportOptions = [
    {
      type: "Daily",
      title: "Daily Attendance Report",
      description: "Detailed log of check-ins and check-outs for a specific day.",
    },
    {
      type: "Monthly",
      title: "Monthly Attendance Summary",
      description: "Aggregated attendance statistics for all employees in a month.",
    },
    {
      type: "Late",
      title: "Late Attendance Report",
      description: "List of employees who checked in after the tolerance period.",
    },
    {
      type: "Summary",
      title: "Office Attendance Overview",
      description: "Comparison of attendance rates across different office locations.",
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and manage attendance reports for your organization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportOptions.map((option) => (
          <Card key={option.type} className="flex flex-col">
            <CardHeader>
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <FileText className="size-5 text-primary" />
              </div>
              <CardTitle className="text-base">{option.title}</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {option.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-0">
              <Link href={`/reports/create?type=${option.type}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Generate
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Generations</h2>
        {isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" />
            <span>Failed to load recent reports</span>
          </div>
        ) : reports?.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">No reports generated yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {reports?.map((report) => (
              <Card key={report.id} className="hover:bg-muted/50 transition-colors">
                <Link href={`/reports/${report.id}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <FileText className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{report.title}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={report.status === "Completed" ? "outline" : "secondary"}>
                        {report.status}
                      </Badge>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
