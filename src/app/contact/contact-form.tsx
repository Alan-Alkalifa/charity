"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sendContactMessage } from "@/app/actions/contact";
import { CheckCircle } from "lucide-react";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const res = await sendContactMessage(formData);
      setResult(res);
      if (res.success) form.reset();
    });
  };

  if (result?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle className="h-12 w-12 text-primary" />
        <p className="text-lg font-semibold">{result.success}</p>
        <Button variant="outline" onClick={() => setResult(null)}>
          Kirim Pesan Lain
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nama *</Label>
          <Input id="name" name="name" placeholder="Nama lengkap Anda" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" placeholder="email@contoh.com" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Subjek *</Label>
        <Input id="subject" name="subject" placeholder="Topik pesan Anda" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Pesan *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tuliskan pesan, pertanyaan, atau masukan Anda..."
          rows={6}
          required
        />
      </div>

      {result?.error && (
        <Alert variant="destructive">
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Mengirim..." : "Kirim Pesan"}
      </Button>
    </form>
  );
}
