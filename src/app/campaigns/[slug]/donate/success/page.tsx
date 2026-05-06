import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DonateSuccessPage({ params }: Props) {
  const { slug } = await params;
  return (
    <section className="container mx-auto px-4 py-24 max-w-md text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">Terima Kasih!</h1>
      <p className="text-muted-foreground">
        Donasi Anda sedang diproses. Kwitansi akan dikirim ke email Anda setelah pembayaran
        dikonfirmasi. Semoga kebaikan Anda menjadi berkah. 🙏
      </p>
      <div className="flex flex-col gap-3">
        <Button asChild>
          <Link href={`/campaigns/${slug}`}>Kembali ke Kampanye</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/campaigns">Lihat Kampanye Lain</Link>
        </Button>
      </div>
    </section>
  );
}
