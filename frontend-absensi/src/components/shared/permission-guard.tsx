'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/features/auth/use-auth';
import { User } from '@/features/auth/auth.service';
import { Permission, hasPermission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
}

/**
 * A component that protects an entire page or section.
 * If the user doesn't have the permission, they are redirected or shown an unauthorized message.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children 
}) => {
  const { user, isCheckingAuth, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!isCheckingAuth && isAuthenticated && !hasPermission(user as User, permission)) {
      router.replace('/unauthorized');
    }
  }, [user, isCheckingAuth, isAuthenticated, permission, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !hasPermission(user as User, permission)) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};
