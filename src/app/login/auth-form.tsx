"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "@/app/actions/auth";

interface Props {
  mode: "login";
  next?: string;
  serverError?: string;
}

export function AuthForm({ mode, next, serverError }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(serverError ?? null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (next) formData.set("next", next);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="email@anda.com" required autoComplete="email" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Kata Sandi</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Masuk..." : "Masuk"}
      </Button>
    </form>
  );
}
