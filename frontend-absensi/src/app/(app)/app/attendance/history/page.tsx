"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter,
  Download,
  Eye,
  History
} from "lucide-react";
import { useAttendanceHistory } from "@/features/attendance/hooks/use-attendance-history";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function AttendanceHistoryPage() {
  const [search, setSearch] = useState("");
  const { data: history, isLoading, isError, refetch } = useAttendanceHistory({ search });
  const records = history?.items ?? [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Present": return "outline";
      case "Late": return "destructive";
      case "Absent": return "secondary";
      case "On Leave": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Attendance History</h1>
          <p className="text-sm text-muted-foreground">
            View and export detailed attendance records for all employees.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-[280px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name..."
                  className="pl-8 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs text-muted-foreground">Period: This Month</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-destructive">Failed to load history</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <History className="size-8 opacity-20" />
                        <p className="text-sm">No attendance records found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {format(new Date(record.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{record.employee_name}</span>
                          <span className="text-xs text-muted-foreground">{record.office_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.check_in || "--:--"}</TableCell>
                      <TableCell>{record.check_out || "--:--"}</TableCell>
                      <TableCell>{record.work_duration || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/app/attendance/history/${record.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
