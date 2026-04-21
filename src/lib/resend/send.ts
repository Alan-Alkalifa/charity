import { getResend, FROM_EMAIL } from "./client";
import { createClient } from "@/lib/supabase/server";
import type { EmailTemplate } from "@/types";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  template: EmailTemplate;
  recipientId?: string;
  metadata?: Record<string, unknown>;
}

export async function sendEmail({
  to,
  subject,
  html,
  template,
  recipientId,
  metadata,
}: SendEmailOptions) {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  const supabase = await createClient();
  await supabase.from("email_logs").insert({
    recipient_id: recipientId ?? null,
    to_email: to,
    template,
    resend_id: data?.id ?? null,
    status: error ? "failed" : "sent",
    metadata: metadata ?? null,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  return data;
}
