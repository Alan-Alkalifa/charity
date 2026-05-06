import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Daftar" };

export default function RegisterPage() {
  return (
    <section className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Heart className="mx-auto h-8 w-8 text-primary fill-primary" />
          <h1 className="text-2xl font-bold">Buat Akun</h1>
          <p className="text-sm text-muted-foreground">Bergabung dan mulai berdonasi bersama kami</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">Masuk</Link>
        </p>
      </div>
    </section>
  );
}
