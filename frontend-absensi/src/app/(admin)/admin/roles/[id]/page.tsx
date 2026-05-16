"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Edit, Shield, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PermissionGuard } from "@/components/shared/permission-guard"
import { useRole } from "@/features/rbac/hooks/use-role"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

interface RoleDetailPageProps {
  params: {
    id: string
  }
}

export default function RoleDetailPage({ params }: RoleDetailPageProps) {
  const router = useRouter()
  const { id } = params
  const { data: role, isLoading, isError } = useRole(id)

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-destructive font-medium">Failed to load role details</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <PermissionGuard permission="role.read">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/roles")}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              All Roles
            </Button>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-2xl font-bold tracking-tight capitalize">
              Role: {id.replace("_", " ")}
            </h1>
          </div>
          <Button 
            onClick={() => router.push(`/admin/roles/${id}/edit`)}
            disabled={id === "super_admin"}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Permissions
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Role ID</span>
                <span className="font-mono text-sm">{id}</span>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Status</span>
                <Badge variant="outline" className="w-fit border-green-500/50 text-green-600 bg-green-50">
                  Active System Role
                </Badge>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Users</span>
                <div className="flex items-center gap-2 font-semibold">
                  <Users className="h-4 w-4" />
                  {role?.user_count ?? 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Assigned Permissions</CardTitle>
                  <CardDescription>
                    {role?.permissions.length ?? 0} permissions active for this role.
                  </CardDescription>
                </div>
                <Shield className="h-5 w-5 text-primary/50" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {id === "super_admin" ? (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 w-full text-center italic text-primary">
                      This role is a Super Administrator and has absolute access to all system features bypasssing all permission checks.
                    </div>
                  ) : role?.permissions.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground italic w-full border border-dashed rounded-lg">
                      No permissions assigned to this role yet.
                    </div>
                  ) : (
                    role?.permissions.map((p) => (
                      <Badge key={p} variant="secondary" className="px-2 py-0.5">
                        {p}
                      </Badge>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  )
}
