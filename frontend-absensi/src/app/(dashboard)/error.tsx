"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-10rem)] w-full flex-col items-center justify-center gap-4 text-center">
      <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-[400px]">
          An unexpected error occurred in this dashboard module. Our team has been notified.
        </p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Button onClick={() => reset()} variant="default">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button onClick={() => window.location.href = "/dashboard"} variant="outline">
          Return Home
        </Button>
      </div>
      {error.digest && (
        <p className="text-[10px] text-muted-foreground mt-8 font-mono">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
