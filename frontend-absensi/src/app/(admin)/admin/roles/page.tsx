"use client"

import * as React from "react"
import { Shield, Plus, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PermissionGuard } from "@/components/shared/permission-guard"
import { RoleTable } from "@/features/rbac/components/role-table"
import { useRoles } from "@/features/rbac/hooks/use-roles"
import { Skeleton } from "@/components/ui/skeleton"

export default function RolesPage() {
  const { data: roles, isLoading, isError, refetch } = useRoles()

  return (
    <PermissionGuard permission="role.read">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
            <p className="text-muted-foreground">
              Manage system roles, permissions, and access control.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <Card className="shadow-md border-primary/10">
          <CardHeader className="bg-primary/5 pb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>System Roles</CardTitle>
            </div>
            <CardDescription>
              A list of all roles available in the system and their associated permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : isError ? (
              <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-destructive/50 bg-destructive/5 text-destructive">
                <p className="font-medium">Failed to load roles</p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <RoleTable roles={roles || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  )
}
