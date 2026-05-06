import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan platform donasi BloomInKindes.",
};

const SECTIONS = [
  {
    title: "1. Penerimaan Syarat",
    body: `Dengan mengakses atau menggunakan platform BloomInKindes, Anda menyatakan telah membaca, memahami, dan menyetujui syarat dan ketentuan ini. Jika Anda tidak setuju, harap hentikan penggunaan layanan kami.`,
  },
  {
    title: "2. Tentang Platform",
    body: `BloomInKindes adalah platform donasi yang memfasilitasi penghimpunan dana dan barang untuk kampanye kemanusiaan yang telah diverifikasi. Kami bertindak sebagai perantara antara donatur dan penerima manfaat, bukan sebagai lembaga keuangan atau badan amal berlisensi secara independen.`,
  },
  {
    title: "3. Donasi Uang",
    body: `Semua donasi uang diproses melalui Midtrans, penyedia pembayaran berlisensi OJK. Setelah pembayaran dikonfirmasi, donasi tidak dapat dikembalikan kecuali terjadi kesalahan teknis yang terdokumentasi. Kwitansi dikirim otomatis ke email yang Anda daftarkan.`,
  },
  {
    title: "4. Donasi Barang (Item Pledge)",
    body: `Pledge barang adalah komitmen untuk menyerahkan barang fisik ke titik pengumpulan atau melalui penjemputan. Anda wajib memenuhi pledge dalam waktu 7 hari setelah dikonfirmasi tim kami. Barang yang diserahkan tidak dapat dikembalikan setelah diterima oleh penerima manfaat.`,
  },
  {
    title: "5. Verifikasi Kampanye",
    body: `Setiap kampanye diverifikasi oleh tim BloomInKindes sebelum dipublikasikan. Namun, kami tidak menjamin keakuratan semua informasi yang disediakan oleh pemohon kampanye. Jika Anda menemukan kampanye yang mencurigakan, harap laporkan melalui email kami.`,
  },
  {
    title: "6. Akun Pengguna",
    body: `Anda bertanggung jawab menjaga kerahasiaan kata sandi akun Anda. Akun tidak boleh digunakan untuk aktivitas penipuan, spam, atau pelanggaran hukum. Kami berhak menangguhkan atau menghapus akun yang melanggar ketentuan ini tanpa pemberitahuan.`,
  },
  {
    title: "7. Relawan",
    body: `Pendaftaran relawan tunduk pada proses seleksi oleh tim kami. Penerimaan sebagai relawan tidak menciptakan hubungan kerja atau kontrak antara Anda dan BloomInKindes. Relawan yang diterima wajib mematuhi kode etik yang akan diberikan saat orientasi.`,
  },
  {
    title: "8. Kekayaan Intelektual",
    body: `Seluruh konten di platform ini — termasuk logo, teks, desain, dan kode — adalah milik BloomInKindes dan dilindungi hukum hak cipta Indonesia. Dilarang menggunakan, menyalin, atau mendistribusikan konten tanpa izin tertulis dari kami.`,
  },
  {
    title: "9. Batasan Tanggung Jawab",
    body: `BloomInKindes tidak bertanggung jawab atas kerugian tidak langsung, kehilangan data, atau gangguan layanan yang disebabkan oleh faktor di luar kendali kami. Total tanggung jawab kami terbatas pada jumlah yang Anda bayarkan dalam 12 bulan terakhir.`,
  },
  {
    title: "10. Hukum yang Berlaku",
    body: `Syarat ini diatur oleh hukum Republik Indonesia. Setiap sengketa diselesaikan melalui musyawarah mufakat terlebih dahulu. Jika tidak tercapai kesepakatan, sengketa diselesaikan melalui Pengadilan Negeri Jakarta Pusat.`,
  },
  {
    title: "11. Perubahan Syarat",
    body: `Kami dapat mengubah syarat ini sewaktu-waktu. Pengguna akan diberitahu melalui email atau notifikasi platform minimal 14 hari sebelum perubahan berlaku untuk ketentuan yang bersifat material.`,
  },
];

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Syarat &amp; Ketentuan</h1>
        <p className="text-muted-foreground">Terakhir diperbarui: 1 Januari 2025</p>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-10">
        Syarat dan ketentuan ini mengatur penggunaan platform BloomInKindes oleh Anda sebagai
        donatur, relawan, atau pengunjung. Harap baca dengan seksama sebelum menggunakan layanan kami.
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
