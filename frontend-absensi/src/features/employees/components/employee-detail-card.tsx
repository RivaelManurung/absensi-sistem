"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Employee } from "../types/employee.type";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Building, Briefcase, Calendar, Shield } from "lucide-react";

interface EmployeeDetailCardProps {
  employee: Employee;
}

export function EmployeeDetailCard({ employee }: EmployeeDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{employee.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{employee.employee_id}</p>
          </div>
          <Badge variant={employee.status === "Active" ? "outline" : "destructive"}>
            {employee.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Email</p>
              <p className="text-sm">{employee.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Phone</p>
              <p className="text-sm">{employee.phone || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Office</p>
              <p className="text-sm">{employee.office_name || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Position</p>
              <p className="text-sm">{employee.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Role</p>
              <Badge variant="secondary" className="capitalize">{employee.role}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Member Since</p>
              <p className="text-sm">{new Date(employee.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Attendance Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold">95%</p>
              <p className="text-[10px] text-muted-foreground uppercase">Attendance Rate</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold">2</p>
              <p className="text-[10px] text-muted-foreground uppercase">Late Entries</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-[10px] text-muted-foreground uppercase">Unexcused Absences</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
