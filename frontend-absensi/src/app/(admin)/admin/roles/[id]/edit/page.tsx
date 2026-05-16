"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Save, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PermissionGuard } from "@/components/shared/permission-guard"
import { PermissionMatrix } from "@/features/rbac/components/permission-matrix"
import { useRole } from "@/features/rbac/hooks/use-role"
import { usePermissions } from "@/features/rbac/hooks/use-permissions"
import { useSyncPermissions } from "@/features/rbac/hooks/use-sync-permissions"
import { Skeleton } from "@/components/ui/skeleton"

interface EditRolePermissionsPageProps {
  params: {
    id: string
  }
}

export default function EditRolePermissionsPage({ params }: EditRolePermissionsPageProps) {
  const router = useRouter()
  const { id } = params
  
  const { data: role, isLoading: isLoadingRole } = useRole(id)
  const { data: allPermissions, isLoading: isLoadingPermissions } = usePermissions()
  const syncPermissions = useSyncPermissions()

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // Initialize selected IDs when role data is loaded
  React.useEffect(() => {
    if (role && allPermissions) {
      const activeIds = allPermissions
        .filter((p) => role.permissions.includes(p.name))
        .map((p) => p.id)
      setSelectedIds(activeIds)
    }
  }, [role, allPermissions])

  const handleSave = () => {
    syncPermissions.mutate({
      roleId: id,
      permissionIds: selectedIds,
    }, {
      onSuccess: () => {
        router.push("/admin/roles")
      }
    })
  }

  const isLoading = isLoadingRole || isLoadingPermissions

  return (
    <PermissionGuard permission="permission.assign">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight capitalize">
              Edit Permissions: {id.replace("_", " ")}
            </h1>
          </div>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 pb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Permission Matrix</CardTitle>
            </div>
            <CardDescription>
              Select the permissions that should be assigned to the <span className="font-bold text-foreground">{id}</span> role.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <PermissionMatrix
                permissions={allPermissions || []}
                selectedPermissionIds={selectedIds}
                onChange={setSelectedIds}
                disabled={id === "super_admin"}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t bg-muted/30 py-4">
            <Button variant="outline" onClick={() => router.back()} disabled={syncPermissions.isPending}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || id === "super_admin" || syncPermissions.isPending}
              className="px-8"
            >
              {syncPermissions.isPending ? "Saving..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Permissions
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PermissionGuard>
  )
}
