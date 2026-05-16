'use client';

import React from 'react';
import { useAuth } from '@/features/auth/use-auth';
import { User } from '@/features/auth/auth.service';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/permissions';

interface CanProps {
  permission?: Permission;
  anyPermission?: Permission[];
  allPermissions?: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders its children based on user permissions.
 * Useful for hiding buttons, links, or sections.
 */
export const Can: React.FC<CanProps> = ({ 
  permission, 
  anyPermission, 
  allPermissions, 
  children, 
  fallback = null 
}) => {
  const { user } = useAuth();

  let allowed = false;

  if (permission) {
    allowed = hasPermission(user as User, permission);
  } else if (anyPermission) {
    allowed = hasAnyPermission(user as User, anyPermission);
  } else if (allPermissions) {
    allowed = hasAllPermissions(user as User, allPermissions);
  } else {
    // If no permission is specified, allow by default
    allowed = true;
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
