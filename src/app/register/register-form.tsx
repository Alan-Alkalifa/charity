"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUp } from "@/app/actions/auth";

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) setMessage({ type: "error", text: result.error });
      else if (result?.success) setMessage({ type: "success", text: result.success });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Nama Lengkap</Label>
        <Input id="full_name" name="full_name" placeholder="Nama Anda" required autoComplete="name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="email@anda.com" required autoComplete="email" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Kata Sandi</Label>
        <Input id="password" name="password" type="password" placeholder="Min. 8 karakter" required minLength={8} autoComplete="new-password" />
      </div>
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "success"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Mendaftar..." : "Daftar Sekarang"}
      </Button>
    </form>
  );
}
