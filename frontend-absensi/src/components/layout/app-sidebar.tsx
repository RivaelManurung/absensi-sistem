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
  Settings,
  User,
  UserCheck,
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

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Attendance",
    url: "/attendance",
    icon: UserCheck,
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users,
  },
  {
    title: "Offices",
    url: "/offices",
    icon: Building2,
  },
  {
    title: "Shifts",
    url: "/shifts",
    icon: Calendar,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
]

const navAccount = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

function isRouteActive(pathname: string, url: string) {
  return url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url)
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-3">
          <Link
            href="/dashboard"
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
              {navMain.map((item) => {
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
            Account
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navAccount.map((item) => {
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
            <AvatarFallback className="text-xs font-medium">AD</AvatarFallback>
          </Avatar>

          <div className="grid min-w-0 flex-1 text-left leading-tight">
            <span className="truncate text-sm font-medium">Admin User</span>
            <span className="truncate text-xs text-muted-foreground">
              admin@absensi.com
            </span>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Sign Out"
              className="h-9 rounded-md px-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Link href="/login">
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}