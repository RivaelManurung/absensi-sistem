"use client"

import * as React from "react"
import { ShieldCheck, Search, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PermissionGuard } from "@/components/shared/permission-guard"
import { usePermissions } from "@/features/rbac/hooks/use-permissions"
import { Skeleton } from "@/components/ui/skeleton"

export default function PermissionsPage() {
  const { data: permissions, isLoading, isError, refetch } = usePermissions()
  const [search, setSearch] = React.useState("")

  const filteredPermissions = React.useMemo(() => {
    if (!permissions) return []
    return permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    )
  }, [permissions, search])

  return (
    <PermissionGuard permission="permission.read">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Permissions</h1>
            <p className="text-muted-foreground">
              Review all granular permissions available in the system.
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
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle>Permission Registry</CardTitle>
            </div>
            <CardDescription>
              A total of {permissions?.length || 0} permissions are registered in the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 max-w-sm relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[300px]">Permission Key</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[150px]">Module</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-32 text-center text-destructive">
                        Failed to load permissions.
                      </TableCell>
                    </TableRow>
                  ) : filteredPermissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                        No permissions found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPermissions.map((perm) => {
                      const module = perm.name.split(".")[0]
                      return (
                        <TableRow key={perm.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-mono text-xs font-semibold text-primary">
                            {perm.name}
                          </TableCell>
                          <TableCell className="text-sm">
                            {perm.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {module}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  )
}
