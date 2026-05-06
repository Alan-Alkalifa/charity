import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = { title: "Masuk" };

interface Props {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { next, error } = await searchParams;
  return (
    <section className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Heart className="mx-auto h-8 w-8 text-primary fill-primary" />
          <h1 className="text-2xl font-bold">Masuk ke BloomInKindes</h1>
          <p className="text-sm text-muted-foreground">Kelola donasi dan pantau kampanye Anda</p>
        </div>
        <AuthForm mode="login" next={next} serverError={error} />
        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </section>
  );
}
