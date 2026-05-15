"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User as UserIcon, 
  ShieldCheck,
  Loader2,
  Camera,
  Settings,
  Mail,
  UserRound,
  LayoutDashboard,
  KeyRound
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmployeeQRCard } from "@/features/employees/components/employee-qr-card";
import { useMe } from "@/features/employees/hooks/use-me";
import { useUpdateProfile } from "@/features/employees/hooks/use-update-profile";
import { ProfileForm } from "@/features/employees/components/profile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { data: employee, isLoading: isLoadingProfile } = useMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse text-sm font-medium">Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-muted-foreground text-lg font-medium">Failed to load profile. Please try again later.</p>
      </div>
    );
  }

  const user = employee.user;

  return (
    <div className="w-full space-y-8 px-6 py-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-6 rounded-3xl border bg-card p-8 shadow-sm md:flex-row md:items-center md:justify-between lg:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={employee.full_name} className="h-full w-full object-cover rounded-3xl" />
              ) : (
                <UserRound className="h-12 w-12" />
              )}
            </div>
            <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-background bg-primary text-primary-foreground shadow-lg">
                <Settings className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {employee.full_name}
              </h1>
              <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 uppercase px-3 py-1 text-xs font-bold">
                {user?.role}
              </Badge>
            </div>

            <p className="text-sm font-medium text-muted-foreground max-w-lg">
              Manage your personal information, security settings, and digital identity.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="w-full justify-start rounded-2xl p-1 h-14 bg-muted/50 mb-6">
              <TabsTrigger value="edit" className="rounded-xl px-8 h-12 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl px-8 h-12 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                <KeyRound className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="mt-0 outline-none">
              <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
                <CardHeader className="bg-muted/30 px-8 py-6">
                  <CardTitle className="text-xl">Account Settings</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 lg:p-10">
                   <ProfileForm 
                    initialData={employee} 
                    onSubmit={(data) => updateProfile(data)} 
                    isLoading={isUpdating} 
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0 outline-none">
                <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
                    <CardHeader className="bg-muted/30 px-8 py-6">
                        <CardTitle className="text-xl">Security Configuration</CardTitle>
                        <CardDescription>
                            Review your account security and authentication methods.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 lg:p-10">
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-amber-900">Security Recommendation</h4>
                                    <p className="text-sm text-amber-700/80 leading-relaxed">
                                        We recommend updating your password every 90 days to ensure maximum account security.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl border bg-card">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <KeyRound className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Two-Factor Authentication</p>
                                            <p className="text-xs text-muted-foreground">Currently enabled via Email</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <EmployeeQRCard employeeId={employee.employee_code} employeeName={employee.full_name} />

          <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="size-32 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 overflow-hidden border-2 border-primary/20 shadow-inner">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={employee.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="size-16 text-primary" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2.5 bg-background border rounded-2xl shadow-lg hover:bg-muted transition-all active:scale-95 group-hover:scale-110">
                  <Camera className="size-5 text-primary" />
                </button>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-bold text-2xl">{employee.full_name}</h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Mail className="size-3" />
                    {employee.email}
                </p>
              </div>

              <Separator className="my-8" />
              
              <div className="w-full space-y-4">
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-green-500/5 ring-1 ring-green-500/10">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="size-5 text-green-500" />
                    <span className="text-sm font-semibold text-green-700 uppercase tracking-wider text-[10px]">Active Session</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                
                <div className="p-4 rounded-2xl bg-muted/30 text-left">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Employment</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Department</span>
                            <span className="font-semibold">{employee.department || "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Position</span>
                            <span className="font-semibold">{employee.position}</span>
                        </div>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/20">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Privacy Protection
            </h3>
            <p className="mt-2 text-sm opacity-60 leading-relaxed font-light">
              Your profile data is protected by industry-standard encryption. Changes to core identity fields may require HR verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
