"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PermissionItem } from "../types/rbac.type"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PermissionMatrixProps {
  permissions: PermissionItem[]
  selectedPermissionIds: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
}

export function PermissionMatrix({
  permissions,
  selectedPermissionIds,
  onChange,
  disabled = false,
}: PermissionMatrixProps) {
  // Group permissions by module (e.g. employee, office, shift)
  const groupedPermissions = React.useMemo(() => {
    const groups: Record<string, PermissionItem[]> = {}
    
    permissions.forEach((perm) => {
      const parts = perm.name.split(".")
      const module = parts[0] || "General"
      if (!groups[module]) {
        groups[module] = []
      }
      groups[module].push(perm)
    })
    
    return groups
  }, [permissions])

  const togglePermission = (id: string) => {
    if (disabled) return
    
    if (selectedPermissionIds.includes(id)) {
      onChange(selectedPermissionIds.filter((pId) => pId !== id))
    } else {
      onChange([...selectedPermissionIds, id])
    }
  }

  const toggleModule = (module: string, checked: boolean | "indeterminate") => {
    if (disabled) return
    
    const modulePermIds = groupedPermissions[module].map((p) => p.id)
    if (checked) {
      // Add all from module
      const newIds = Array.from(new Set([...selectedPermissionIds, ...modulePermIds]))
      onChange(newIds)
    } else {
      // Remove all from module
      onChange(selectedPermissionIds.filter((id) => !modulePermIds.includes(id)))
    }
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedPermissions).map(([module, perms]) => {
        const allModuleSelected = perms.every((p) => selectedPermissionIds.includes(p.id))
        const someModuleSelected = perms.some((p) => selectedPermissionIds.includes(p.id)) && !allModuleSelected

        return (
          <div key={module} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`module-${module}`}
                  checked={allModuleSelected}
                  // @ts-ignore
                  indeterminate={someModuleSelected}
                  onCheckedChange={(checked: boolean | "indeterminate") => toggleModule(module, checked)}
                  disabled={disabled}
                />
                <Label
                  htmlFor={`module-${module}`}
                  className="text-sm font-bold capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {module} Module
                </Label>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {perms.length} Permissions
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {perms.map((perm) => (
                <div key={perm.id} className="flex items-start space-x-3 rounded-md p-2 transition-colors hover:bg-accent/50">
                  <Checkbox
                    id={perm.id}
                    checked={selectedPermissionIds.includes(perm.id)}
                    onCheckedChange={() => togglePermission(perm.id)}
                    disabled={disabled}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={perm.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {perm.name.split(".").slice(1).join(" ") || perm.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {perm.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
