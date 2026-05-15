import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex h-[calc(100vh-10rem)] w-full flex-col items-center justify-center gap-4 text-center">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-2">
        <FileQuestion className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
        <p className="text-muted-foreground max-w-[400px]">
          The resource you are looking for might have been moved, deleted, or does not exist.
        </p>
      </div>
      <Link href="/admin/dashboard" className="mt-4">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
