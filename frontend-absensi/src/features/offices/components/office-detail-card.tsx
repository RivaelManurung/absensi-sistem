"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Office } from "../types/office.type";
import { Separator } from "@/components/ui/separator";
import { MapPin, Globe, Users, Navigation } from "lucide-react";

interface OfficeDetailCardProps {
  office: Office;
}

export function OfficeDetailCard({ office }: OfficeDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{office.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{office.code}</p>
          </div>
          <Badge variant={office.status === "Active" ? "outline" : "destructive"}>
            {office.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 col-span-2">
            <MapPin className="size-4 text-muted-foreground mt-1" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Address</p>
              <p className="text-sm">{office.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Navigation className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Coordinates</p>
              <p className="text-sm font-mono">
                {office.latitude ? office.latitude.toFixed(6) : "N/A"}, {office.longitude ? office.longitude.toFixed(6) : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Radius</p>
              <p className="text-sm">{office.radius_meter} meters</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Employees</p>
              <p className="text-sm">{office.total_employees || 0} Employees</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Geofence Configuration</h3>
          <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center border border-dashed">
            <div className="text-center p-6">
              <MapPin className="size-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Map visualization for geofence (Radius: {office.radius_meter}m)</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Latitude: {office.latitude ?? "N/A"} | Longitude: {office.longitude ?? "N/A"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
