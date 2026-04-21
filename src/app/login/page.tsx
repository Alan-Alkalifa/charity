import type { Metadata } from "next";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <section className="container mx-auto px-4 py-24 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Masuk ke Akun</h1>
      <p className="text-muted-foreground text-center">Form login Supabase Auth akan dibangun di sini.</p>
    </section>
  );
}
