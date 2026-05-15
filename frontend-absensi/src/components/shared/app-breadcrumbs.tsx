"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

export function AppBreadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path !== "");
  const root = paths[0];
  const isAdmin = root === "admin";
  const rootHref = isAdmin ? "/admin/dashboard" : "/app/dashboard";
  const rootLabel = isAdmin ? "Dashboard" : "App";

  if (paths.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={rootHref} />}>{rootLabel}</BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((path, index) => {
          if ((path === "admin" || path === "app") && index === 0) return null;
          if (path === "dashboard" && index === 1) return null;

          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;
          const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href} />}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
