"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MapErrorStateProps {
  onRetry?: () => void;
  message?: string;
}

export function MapErrorState({ onRetry, message = "Failed to load the map. Please check your connection and try again." }: MapErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[400px] bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 text-center">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Map</AlertTitle>
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="mt-4 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
