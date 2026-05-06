"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend/send";

export async function applyAsVolunteer(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Anda harus login terlebih dahulu" };

  const skills = String(formData.get("skills") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase.from("volunteers").insert({
    profile_id: user.id,
    motivation: String(formData.get("motivation") || ""),
    skills,
    availability: String(formData.get("availability") || ""),
    area: String(formData.get("area") || ""),
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") return { error: "Anda sudah mendaftar sebagai relawan" };
    return { error: "Gagal mendaftar. Coba lagi." };
  }

  // Send welcome email
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (user.email) {
    await sendEmail({
      to: user.email,
      subject: "Pendaftaran Relawan Diterima — BloomInKindes",
      html: `
        <h2>Halo ${profile?.full_name ?? "Kawan"}!</h2>
        <p>Terima kasih telah mendaftar sebagai relawan BloomInKindes.</p>
        <p>Tim kami akan meninjau pendaftaran Anda dan menghubungi Anda dalam 3–5 hari kerja.</p>
        <p>Sampai jumpa di lapangan! 💪</p>
      `,
      template: "volunteer_welcome",
      recipientId: user.id,
    }).catch(() => null);
  }

  return { success: "Pendaftaran relawan berhasil dikirim!" };
}
