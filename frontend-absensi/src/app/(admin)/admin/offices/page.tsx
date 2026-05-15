"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  Building
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOffices } from "@/features/offices/hooks/use-offices";
import { useDeleteOffice } from "@/features/offices/hooks/use-delete-office";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { toastHelper } from "@/lib/toast";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function OfficesPage() {
  const [search, setSearch] = useState("");
  const { data: offices, isLoading, isError, error, refetch } = useOffices({ search });
  const deleteMutation = useDeleteOffice();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const officeToDelete = offices?.find(o => o.id === deleteId);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteMutation.mutateAsync(deleteId);
        toastHelper.success("Office deleted", "The office location has been removed successfully.");
        setDeleteId(null);
      } catch (err: any) {
        toastHelper.error("Delete failed", err.response?.data?.message || "Could not delete the office.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Offices</h1>
          <p className="text-sm text-muted-foreground">
            Manage your company office locations and geofence rules.
          </p>
        </div>
        <Link href="/admin/offices/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Office
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-[280px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search offices..."
                  className="pl-8 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Office Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Radius</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-destructive">
                          {error instanceof Error ? error.message : "Failed to load offices"}
                        </p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : offices?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Building className="size-8 opacity-20" />
                        <p className="text-sm">No offices found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  offices?.map((office) => (
                    <TableRow key={office.id}>
                      <TableCell className="font-medium">{office.name}</TableCell>
                      <TableCell>{office.code}</TableCell>
                      <TableCell className="max-w-[250px] truncate">{office.address}</TableCell>
                      <TableCell>{office.radius_meter}m</TableCell>
                      <TableCell>
                        <Badge 
                          variant={office.status === "Active" ? "outline" : "secondary"}
                        >
                          {office.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link href={`/admin/offices/${office.id}`}>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/admin/offices/${office.id}/edit`}>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Office
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                onClick={() => setDeleteId(office.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Office
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DeleteDialog 
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Office"
        description={`Are you sure you want to delete ${officeToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
