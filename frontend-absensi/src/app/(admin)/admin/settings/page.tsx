"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Building, 
  Clock, 
  Shield, 
  Bell,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your organization&apos;s preferences and system rules.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="size-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Clock className="size-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="size-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Update your company information and localization settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Absensi Enterprise Ltd." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="Asia/Jakarta (GMT+7)" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Input id="date-format" defaultValue="DD/MM/YYYY" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Rules</CardTitle>
                <CardDescription>Configure global rules for check-ins and geofencing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>Allow Outside Geofence</Label>
                    <p className="text-xs text-muted-foreground italic">Allow employees to check in even when outside office radius (will be flagged).</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>Automatic Checkout</Label>
                    <p className="text-xs text-muted-foreground italic">Automatically check out employees at the end of their shift.</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="default-radius">Default Radius (meters)</Label>
                    <Input id="default-radius" type="number" defaultValue="100" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="global-tolerance">Global Late Tolerance (mins)</Label>
                    <Input id="global-tolerance" type="number" defaultValue="15" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Rules
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>System Security</CardTitle>
                <CardDescription>Manage password policies and session behavior.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>Force Password Reset</Label>
                    <p className="text-xs text-muted-foreground italic">Require all users to reset their password every 90 days.</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>Multi-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground italic">Require email or SMS verification for administrative actions.</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="grid gap-2 pt-2">
                  <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                  <Input id="session-timeout" type="number" defaultValue="24" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Security
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how and when system alerts are sent.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>Daily Summary Emails</Label>
                    <p className="text-xs text-muted-foreground italic">Send a summary of yesterday&apos;s attendance to HR every morning.</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>Late Attendance Alerts</Label>
                    <p className="text-xs text-muted-foreground italic">Notify HR immediately when an employee is late.</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>Shift Start Reminders</Label>
                    <p className="text-xs text-muted-foreground italic">Send mobile notifications to employees 15 minutes before shift starts.</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Notification Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
