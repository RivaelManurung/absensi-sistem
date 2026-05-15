import { Skeleton } from "@/components/ui/skeleton";

export function GeofenceMapSkeleton() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted/50">
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 text-center">
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    </div>
  );
}
