import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi BloomInKindes — bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.",
};

const SECTIONS = [
  {
    title: "1. Informasi yang Kami Kumpulkan",
    body: `Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, alamat email, nomor telepon, dan alamat pengiriman saat Anda melakukan donasi atau mendaftar sebagai relawan. Kami juga mengumpulkan data teknis seperti alamat IP, jenis perangkat, dan halaman yang Anda kunjungi melalui cookie dan log server.`,
  },
  {
    title: "2. Cara Kami Menggunakan Informasi",
    body: `Informasi Anda digunakan untuk: memproses donasi dan menerbitkan kwitansi, mengirimkan konfirmasi dan pembaruan kampanye, mengelola pendaftaran relawan, meningkatkan layanan dan pengalaman pengguna, serta memenuhi kewajiban hukum yang berlaku.`,
  },
  {
    title: "3. Pembagian Informasi",
    body: `Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Data dapat dibagikan kepada: penyedia layanan pembayaran (Midtrans) untuk memproses transaksi, penyedia layanan email (Resend) untuk pengiriman notifikasi, dan otoritas hukum jika diwajibkan oleh peraturan perundang-undangan.`,
  },
  {
    title: "4. Keamanan Data",
    body: `Kami menggunakan enkripsi SSL/TLS untuk semua transmisi data. Data disimpan di Supabase dengan Row-Level Security (RLS) yang memastikan setiap pengguna hanya dapat mengakses data miliknya sendiri. Pembayaran diproses sepenuhnya oleh Midtrans dan kami tidak menyimpan data kartu kredit.`,
  },
  {
    title: "5. Retensi Data",
    body: `Data donasi disimpan selama 7 tahun sesuai ketentuan perpajakan Indonesia. Data akun disimpan selama akun aktif dan 2 tahun setelah penghapusan. Anda dapat meminta penghapusan data non-mandatory kapan saja melalui email kami.`,
  },
  {
    title: "6. Hak Anda",
    body: `Anda berhak untuk: mengakses data pribadi yang kami simpan, meminta koreksi data yang tidak akurat, meminta penghapusan data (dengan batasan kewajiban hukum), menarik persetujuan penggunaan data untuk pemasaran, dan mengajukan keluhan kepada otoritas perlindungan data.`,
  },
  {
    title: "7. Cookie",
    body: `Kami menggunakan cookie sesi untuk autentikasi pengguna (Supabase Auth) dan cookie analitik yang dapat Anda nonaktifkan melalui pengaturan browser. Kami tidak menggunakan cookie pelacak pihak ketiga untuk periklanan.`,
  },
  {
    title: "8. Perubahan Kebijakan",
    body: `Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di website. Penggunaan layanan setelah perubahan berlaku berarti Anda menyetujui kebijakan yang diperbarui.`,
  },
  {
    title: "9. Hubungi Kami",
    body: `Pertanyaan tentang kebijakan privasi ini dapat dikirimkan ke: privasi@bloominkindes.org atau melalui halaman Kontak kami.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Kebijakan Privasi</h1>
        <p className="text-muted-foreground">Terakhir diperbarui: 1 Januari 2025</p>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-10">
        BloomInKindes (&quot;kami&quot;) berkomitmen melindungi privasi Anda. Kebijakan ini menjelaskan
        bagaimana kami mengumpulkan, menggunakan, dan menjaga informasi pribadi Anda saat menggunakan
        platform donasi kami di bloominkindes.org.
      </p>

      <div className="space-y-8">
        {SECTIONS.map(({ title, body }) => (
          <div key={title}>
            <h2 className="text-lg font-semibold mb-3">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
