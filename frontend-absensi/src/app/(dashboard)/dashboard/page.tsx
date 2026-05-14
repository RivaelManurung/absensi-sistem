"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  CalendarCheck, 
  MapPinOff, 
  UserMinus,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stats = [
  {
    title: "Total Employees",
    value: "1,284",
    icon: Users,
    description: "4 new employees added this month",
    color: "text-primary",
  },
  {
    title: "Present Today",
    value: "1,156",
    icon: CalendarCheck,
    description: "90.2% of total employees",
    color: "text-green-600",
  },
  {
    title: "Late Today",
    value: "12",
    icon: Clock,
    description: "3.5% decrease from yesterday",
    color: "text-yellow-600",
  },
  {
    title: "Absent Today",
    value: "116",
    icon: UserMinus,
    description: "Including annual and sick leave",
    color: "text-red-600",
  },
  {
    title: "Outside Radius",
    value: "4",
    icon: MapPinOff,
    description: "Unverified location detection",
    color: "text-orange-600",
  },
];

const recentAttendance = [
  {
    id: "1",
    employee: "John Doe",
    email: "john.doe@company.com",
    checkIn: "08:02 AM",
    checkOut: "05:15 PM",
    status: "Present",
    location: "Main Office",
    accuracy: "98%",
  },
  {
    id: "2",
    employee: "Jane Smith",
    email: "jane.s@company.com",
    checkIn: "08:45 AM",
    checkOut: "-",
    status: "Late",
    location: "Main Office",
    accuracy: "95%",
  },
  {
    id: "3",
    employee: "Robert Brown",
    email: "robert.b@company.com",
    checkIn: "07:55 AM",
    checkOut: "05:02 PM",
    status: "Present",
    location: "Branch A",
    accuracy: "99%",
  },
  {
    id: "4",
    employee: "Emily White",
    email: "emily.w@company.com",
    checkIn: "08:05 AM",
    checkOut: "-",
    status: "Present",
    location: "Main Office",
    accuracy: "92%",
  },
  {
    id: "5",
    employee: "Michael Green",
    email: "michael.g@company.com",
    checkIn: "-",
    checkOut: "-",
    status: "Absent",
    location: "-",
    accuracy: "-",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your attendance system and team activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
          <Button size="sm">
            Add Employee
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Attendance Log</CardTitle>
              <CardDescription>
                A detailed list of employee check-ins and check-outs for today.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-[260px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employee..."
                  className="pl-8 h-9"
                />
              </div>
              <Button variant="outline" size="sm">Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Employee</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAttendance.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{row.employee}</span>
                        <span className="text-xs text-muted-foreground">{row.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{row.checkIn}</TableCell>
                    <TableCell className="font-mono text-xs">{row.checkOut}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.status === "Present"
                            ? "outline"
                            : row.status === "Late"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{row.location}</TableCell>
                    <TableCell className="text-xs">{row.accuracy}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Entry</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Flag Issue</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="flex items-center justify-between px-6 pb-6 pt-0 mt-0">
          <p className="text-xs text-muted-foreground">Showing 5 of 1,284 entries</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

