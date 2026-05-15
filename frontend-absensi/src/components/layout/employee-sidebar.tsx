"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Clock3, History, LayoutDashboard, LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/use-auth";

const navMain = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Attendance",
    url: "/app/attendance",
    icon: CalendarDays,
  },
  {
    title: "History",
    url: "/app/attendance/history",
    icon: History,
  },
];

const navAccount = [
  {
    title: "Profile",
    url: "/app/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/app/settings",
    icon: Settings,
  },
];

function isRouteActive(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`);
}

export function EmployeeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const displayName = user?.name || user?.email || "Account";
  const displayEmail = user?.email || "Signed in";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-3">
          <Link
            href="/app/attendance"
            className="group flex min-w-0 items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-accent"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
              <Clock3 className="size-4 text-foreground" />
            </div>
            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold tracking-tight">Absensi</span>
              <span className="truncate text-xs text-muted-foreground">Employee App</span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            Attendance
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isRouteActive(pathname, item.url)}
                    className="h-9 rounded-md px-2 text-sm font-medium data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4 text-muted-foreground" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
              {navAccount.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isRouteActive(pathname, item.url)}
                    className="h-9 rounded-md px-2 text-sm font-medium data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4 text-muted-foreground" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
            <span className="truncate text-xs text-muted-foreground">{displayEmail}</span>
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
  );
}
