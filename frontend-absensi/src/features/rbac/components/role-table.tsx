"use client"

import * as React from "react"
import Link from "next/link"
import {
  MoreHorizontal,
  Plus,
  Shield,
  ShieldCheck,
  Users,
  Search,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Role } from "../types/rbac.type"

interface RoleTableProps {
  roles: Role[]
}

export function RoleTable({ roles }: RoleTableProps) {
  const [search, setSearch] = React.useState("")

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[250px]">Role Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="w-[150px]">Users</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background shadow-sm">
                        {role.id === "super_admin" ? (
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Shield className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="grid gap-0.5">
                        <span className="font-semibold capitalize">
                          {role.name.replace("_", " ")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {role.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.id === "super_admin" ? (
                        <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                          All Permissions (*)
                        </Badge>
                      ) : (
                        <>
                          {role.permissions.slice(0, 3).map((p) => (
                            <Badge key={p} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {p}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                          {role.permissions.length === 0 && (
                            <span className="text-xs text-muted-foreground italic">
                              No permissions assigned
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {role.user_count} Users
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/admin/roles/${role.id}`}>
                          <DropdownMenuItem>
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        {role.id !== "super_admin" ? (
                          <Link href={`/admin/roles/${role.id}/edit`}>
                            <DropdownMenuItem>
                              Edit Permissions
                            </DropdownMenuItem>
                          </Link>
                        ) : (
                          <DropdownMenuItem disabled>
                            Edit Permissions
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
