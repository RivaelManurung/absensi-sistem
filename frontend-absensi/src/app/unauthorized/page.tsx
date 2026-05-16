'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 rounded-full bg-destructive/10 p-6">
        <ShieldAlert className="h-16 w-16 text-destructive" />
      </div>
      
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Access Denied</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        You do not have the required permissions to access this page. 
        Please contact your administrator if you believe this is an error.
      </p>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={() => window.history.back()} className="rounded-xl px-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        
        <Button asChild className="rounded-xl px-8">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
      
      <div className="mt-12 text-sm text-muted-foreground">
        Error Code: 403 Forbidden
      </div>
    </div>
  );
}
