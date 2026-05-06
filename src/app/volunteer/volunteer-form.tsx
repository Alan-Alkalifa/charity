"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { applyAsVolunteer } from "@/app/actions/volunteer";

export function VolunteerForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await applyAsVolunteer(formData);
      setResult(res);
    });
  };

  if (result?.success) {
    return (
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Pendaftaran Berhasil!</AlertTitle>
        <AlertDescription>{result.success}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="motivation">Motivasi Menjadi Relawan *</Label>
        <Textarea
          id="motivation"
          name="motivation"
          placeholder="Ceritakan mengapa Anda ingin bergabung sebagai relawan..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="skills">Keahlian</Label>
        <Input
          id="skills"
          name="skills"
          placeholder="Contoh: mengajar, medis, logistik, fotografi (pisahkan dengan koma)"
        />
        <p className="text-xs text-muted-foreground">Pisahkan dengan koma</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="availability">Ketersediaan Waktu</Label>
        <Input
          id="availability"
          name="availability"
          placeholder="Contoh: Sabtu–Minggu, atau weekend saja"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="area">Kota/Wilayah</Label>
        <Input id="area" name="area" placeholder="Contoh: Jakarta Selatan" />
      </div>

      {result?.error && (
        <Alert variant="destructive">
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Mengirim..." : "Kirim Pendaftaran"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Anda harus login untuk mendaftar. Tim kami akan menghubungi dalam 3–5 hari kerja.
      </p>
    </form>
  );
}
