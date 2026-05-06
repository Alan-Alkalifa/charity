"use server";

import { sendEmail } from "@/lib/resend/send";

interface ContactResult {
  error?: string;
  success?: string;
}

export async function sendContactMessage(
  formData: FormData
): Promise<ContactResult> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !subject || !message) {
    return { error: "Semua kolom wajib diisi." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Format email tidak valid." };
  }

  if (message.length < 10) {
    return { error: "Pesan terlalu singkat, minimal 10 karakter." };
  }

  const adminEmail = process.env.RESEND_FROM_EMAIL ?? "info@bloominkindes.org";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1a5c3b">Pesan Kontak Baru — BloomInKindes</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;font-weight:600;width:120px">Nama</td><td>${name}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Subjek</td><td>${subject}</td></tr>
      </table>
      <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb"/>
      <p style="white-space:pre-wrap;line-height:1.6">${message}</p>
      <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb"/>
      <p style="color:#6b7280;font-size:12px">Dikirim dari form kontak bloominkindes.org</p>
    </div>
  `;

  try {
    await sendEmail({
      to: adminEmail,
      subject: `[Kontak] ${subject} — dari ${name}`,
      html,
      template: "contact",
      metadata: { sender_name: name, sender_email: email },
    });

    // Auto-reply to sender
    const replyHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a5c3b">Terima kasih, ${name}!</h2>
        <p>Kami telah menerima pesan Anda dan akan merespons dalam 1–2 hari kerja.</p>
        <p style="font-style:italic;color:#6b7280">Pesan Anda:</p>
        <blockquote style="border-left:3px solid #1a5c3b;margin:0;padding:0 16px;color:#374151">${message}</blockquote>
        <br/>
        <p>Salam hangat,<br/><strong>Tim BloomInKindes</strong></p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Kami terima pesan Anda — BloomInKindes",
      html: replyHtml,
      template: "contact",
      metadata: { auto_reply: true },
    });
  } catch {
    return { error: "Gagal mengirim pesan. Silakan coba lagi nanti." };
  }

  return { success: "Pesan berhasil dikirim! Kami akan membalas dalam 1–2 hari kerja." };
}
