"use client";

import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Target, Trash2 } from "lucide-react";
import { GeofenceMapSkeleton } from "@/components/maps/geofence-map-skeleton";
import { CurrentLocationButton } from "@/components/maps/current-location-button";
import { OfficeFormValues } from "../schemas/office.schema";

// Dynamic import for map to avoid SSR issues
const GeofencePickerMap = dynamic(
  () => import("@/components/maps/geofence-picker-map"),
  { 
    ssr: false,
    loading: () => <GeofenceMapSkeleton />
  }
);

export function OfficeLocationFormSection() {
  const { control, setValue, watch, trigger } = useFormContext<OfficeFormValues>();
  
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const radiusMeters = watch("radius_meter");
  const geofenceEnabled = watch("geofence_enabled");

  const handleLocationChange = (lat: number, lng: number) => {
    setValue("latitude", lat, { shouldDirty: true, shouldValidate: true });
    setValue("longitude", lng, { shouldDirty: true, shouldValidate: true });
  };

  const handleResetLocation = () => {
    setValue("latitude", null, { shouldDirty: true, shouldValidate: true });
    setValue("longitude", null, { shouldDirty: true, shouldValidate: true });
  };

  const handleCenterMap = () => {
    // This is handled by the MapController in the GeofencePickerMap
    // by triggering a re-render/effect with same coordinates
    trigger(["latitude", "longitude"]);
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Office Location & Geofence
            </CardTitle>
            <CardDescription>
              Set the physical location of the office and geofence radius for attendance validation.
            </CardDescription>
          </div>
          <FormField
            control={control}
            name="geofence_enabled"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormLabel className="text-sm font-medium">Enable Geofence</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="any" 
                    placeholder="e.g. -6.200000"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="any" 
                    placeholder="e.g. 106.816666"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="radius_meter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Radius (Meters)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="10" 
                    max="5000"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Allowed distance for attendance.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <CurrentLocationButton 
              onLocationFound={(lat, lng) => handleLocationChange(lat, lng)} 
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCenterMap}
              disabled={latitude === null || longitude === null}
            >
              <Target className="h-4 w-4 mr-2" />
              Center Map
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleResetLocation}
              disabled={latitude === null && longitude === null}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Reset Location
            </Button>
          </div>

          <GeofencePickerMap 
            latitude={latitude}
            longitude={longitude}
            radiusMeters={radiusMeters}
            enabled={geofenceEnabled}
            onLocationChange={(loc) => handleLocationChange(loc.latitude, loc.longitude)}
          />

          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Click on the map or drag the marker to adjust the office location.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
