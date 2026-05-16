"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  Calendar,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  QrCode,
  Settings,
  Shield,
  ShieldCheck,
  User,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/features/auth/use-auth"
import { Permission, hasPermission } from "@/lib/permissions"

const navMain = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard.read" as Permission,
  },
  {
    title: "Employees",
    url: "/admin/employees",
    icon: Users,
    permission: "employee.read" as Permission,
  },
  {
    title: "Offices",
    url: "/admin/offices",
    icon: Building2,
    permission: "office.read" as Permission,
  },
  {
    title: "Shifts",
    url: "/admin/shifts",
    icon: Calendar,
    permission: "shift.read" as Permission,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: FileText,
    permission: "report.read" as Permission,
  },
]

const navSecurity = [
  {
    title: "Roles",
    url: "/admin/roles",
    icon: Shield,
    permission: "role.read" as Permission,
  },
  {
    title: "Permissions",
    url: "/admin/permissions",
    icon: ShieldCheck,
    permission: "permission.read" as Permission,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
    permission: "user.read" as Permission,
  },
]

const navApp = [
  {
    title: "QR Attendance",
    url: "/app/attendance",
    icon: QrCode,
    permission: "attendance.self.check_in" as Permission,
  },
  {
    title: "Attendance History",
    url: "/app/attendance/history",
    icon: Clock3,
    permission: "attendance.history.read" as Permission,
  },
]

const navAccount = [
  {
    title: "Profile",
    url: "/app/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    permission: "setting.manage" as Permission,
  },
]

function isRouteActive(pathname: string, url: string) {
  return url === "/admin/dashboard" ? pathname === "/admin/dashboard" : pathname.startsWith(url)
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const displayName = user?.name || user?.email || "Account"
  const displayEmail = user?.email || "Signed in"
  const initials = displayName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-3">
          <Link
            href="/admin/dashboard"
            className="group flex min-w-0 items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-accent"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
              <Clock3 className="size-4 text-foreground" />
            </div>

            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold tracking-tight">
                Absensi
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Enterprise System
              </span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            Management
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navMain
                .filter((item) => !item.permission || hasPermission(user, item.permission))
                .map((item) => {
                  const active = isRouteActive(pathname, item.url)

                  return (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={active}
                      className="h-9 rounded-md px-2 text-sm font-medium data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4 text-muted-foreground" />
                        <span>{item.title}</span>

                        {item.title === "Reports" ? (
                          <Badge
                            variant="secondary"
                            className="ml-auto h-5 rounded-md px-1.5 text-[10px] font-medium"
                          >
                            New
                          </Badge>
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            RBAC & Security
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navSecurity
                .filter((item) => !item.permission || hasPermission(user, item.permission))
                .map((item) => {
                  const active = isRouteActive(pathname, item.url)

                  return (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={active}
                      className="h-9 rounded-md px-2 text-sm font-medium data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4 text-muted-foreground" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            Employee App
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navApp
                .filter((item) => !item.permission || hasPermission(user, item.permission))
                .map((item) => {
                  const active = isRouteActive(pathname, item.url)

                  return (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={active}
                      className="h-9 rounded-md px-2 text-sm font-medium data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4 text-muted-foreground" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            Account
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navAccount
                .filter((item) => !item.permission || hasPermission(user, item.permission))
                .map((item) => {
                  const active = isRouteActive(pathname, item.url)

                  return (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={active}
                      className="h-9 rounded-md px-2 text-sm font-medium data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4 text-muted-foreground" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <div className="mb-2 flex items-center gap-3 rounded-lg border bg-card p-2 shadow-sm">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
          </Avatar>

          <div className="grid min-w-0 flex-1 text-left leading-tight">
            <span className="truncate text-sm font-medium">{displayName}</span>
            <span className="truncate text-xs text-muted-foreground">
              {displayEmail}
            </span>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              className="h-9 rounded-md px-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
