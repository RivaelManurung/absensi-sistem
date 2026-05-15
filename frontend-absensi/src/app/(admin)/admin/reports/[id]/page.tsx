"use client";

import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/features/reports/services/report.service";
import { 
  ArrowLeft, 
  ChevronLeft, 
  Loader2, 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter, 
  CardDescription 
} from "@/components/ui/card";

export default function ReportDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: report, isLoading, isError } = useQuery({
    queryKey: ["reports", id],
    queryFn: () => reportService.getById(id),
    refetchInterval: (query) => (query.state.data?.status === "Processing" ? 3000 : false),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse text-sm font-medium">Fetching report status...</p>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <Card className="w-full max-w-md rounded-2xl border-dashed">
          <CardHeader className="items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Report Not Found</CardTitle>
            <CardDescription>
              Laporan tidak ditemukan atau gagal dimuat. Silakan periksa kembali filter atau coba buat laporan baru.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/reports">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCompleted = report.status === "Completed";
  const isProcessing = report.status === "Processing";
  const isFailed = report.status === "Failed";

  return (
    <div className="w-full space-y-8 px-6 py-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-6 rounded-3xl border bg-card p-8 shadow-sm md:flex-row md:items-center md:justify-between lg:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
              <FileText className="h-12 w-12" />
            </div>
            <div className={`absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-background ${isCompleted ? 'bg-green-500' : isProcessing ? 'bg-amber-500' : 'bg-destructive'}`} />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {report.title || "Attendance Report"}
              </h1>
              <Badge variant="secondary" className={`rounded-full ${isCompleted ? 'bg-green-500/10 text-green-600' : isProcessing ? 'bg-amber-500/10 text-amber-600' : 'bg-destructive/10 text-destructive'}`}>
                {report.status}
              </Badge>
            </div>

            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-foreground">TYPE</span>
              {report.type}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="bg-muted/50 font-medium">
                <Calendar className="mr-1.5 h-3 w-3 text-primary" />
                {report.date_range.from} — {report.date_range.to}
              </Badge>
              <Badge variant="outline" className="bg-muted/50 font-medium capitalize">
                {report.format}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:self-start">
           <Button variant="outline" size="lg" asChild className="rounded-xl px-6">
            <Link href="/admin/reports">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Reports
            </Link>
          </Button>
          
          <Button
            size="lg"
            className="rounded-xl px-6"
            disabled={!isCompleted}
            asChild={isCompleted}
          >
            {isCompleted ? (
               <a href={report.file_url} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </a>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_400px]">
        {/* Left Column: Detailed Info */}
        <div className="space-y-8">
          <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
            <CardHeader className="bg-muted/30 px-8 py-6">
              <CardTitle className="text-xl">Generation Process</CardTitle>
              <CardDescription>
                Detail status dan parameter pembuatan laporan.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
               {isProcessing && (
                <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
                  <div className="relative">
                    <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold">Generating Report...</p>
                    <p className="text-muted-foreground max-w-sm">
                      Sistem sedang mengolah data absensi Anda. Halaman ini akan diperbarui secara otomatis saat selesai.
                    </p>
                  </div>
                  <div className="w-full max-w-md h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-stripes w-[60%]" />
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="space-y-8">
                  <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-8 flex items-start gap-6">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-700">Laporan Siap Diunduh</p>
                      <p className="text-green-600/80 mt-1">
                        Data telah berhasil divalidasi dan dikonversi ke format {report.format}. Anda dapat mengunduh file melalui tombol di atas atau link di bawah ini.
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Report Filename</p>
                      <p className="font-mono text-sm bg-muted p-3 rounded-lg truncate">
                         {report.title.replace(/\s+/g, '_').toLowerCase()}_{id.substring(0,8)}.{report.format.toLowerCase()}
                      </p>
                    </div>
                     <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated Date</p>
                      <p className="text-sm font-medium p-3">
                         {new Date(report.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isFailed && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 flex items-start gap-6 text-destructive">
                  <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">Terjadi Kesalahan</p>
                    <p className="opacity-80 mt-1">
                      Gagal dalam memproses data laporan. Hal ini biasanya terjadi karena rentang tanggal yang terlalu besar atau data yang tidak ditemukan.
                    </p>
                    <Button variant="destructive" className="mt-4 rounded-xl" asChild>
                      <Link href="/admin/reports">Coba Lagi</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Meta Info */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-none shadow-md ring-1 ring-border">
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
              <CardDescription>
                Informasi teknis laporan.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Format</span>
                <Badge variant="outline">{report.format}</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-bold">{report.status}</span>
              </div>
               <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">ID Laporan</span>
                <span className="text-xs font-mono text-muted-foreground truncate ml-4">{id}</span>
              </div>
            </CardContent>
          </Card>

           <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
            <h3 className="text-lg font-bold">Info Laporan</h3>
            <p className="mt-2 text-sm opacity-80">
              Laporan ini mencakup seluruh data kehadiran karyawan berdasarkan parameter yang Anda tentukan saat pembuatan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
