import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Kampanye: ${slug}` };
}

export default async function CampaignDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Kampanye: {slug}</h1>
      <p className="text-muted-foreground">Detail kampanye, form donasi uang/barang akan dibangun di sini.</p>
    </section>
  );
}
