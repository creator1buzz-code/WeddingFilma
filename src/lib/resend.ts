import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM ?? "WeddingFilma <bookings@weddingfilma.in>";
const ADMIN = process.env.EMAIL_ADMIN ?? "info@weddingfilma.in";

type Booking = {
  bookingCode: string;
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: Date | string;
  city: string;
  venue?: string | null;
  services?: string[];
  notes?: string | null;
};

const layout = (title: string, body: string) => `
<!doctype html>
<html><body style="font-family:Georgia,serif;background:#0f0d0c;padding:40px;color:#efe7d9;">
  <div style="max-width:560px;margin:0 auto;background:#1a1614;border-radius:16px;padding:40px;border:1px solid #3a2f22;">
    <p style="font-family:Fraunces,serif;letter-spacing:.3em;font-size:12px;color:#d4a574;margin:0 0 8px;text-transform:uppercase;">WeddingFilma</p>
    <h1 style="font-family:Fraunces,serif;font-weight:400;font-size:28px;margin:0 0 16px;color:#efe7d9;">${title}</h1>
    ${body}
    <hr style="border:none;border-top:1px solid #3a2f22;margin:32px 0;" />
    <p style="font-size:12px;color:#8a7f70;">WeddingFilma.in · Cinematic wedding films & photography · India</p>
  </div>
</body></html>`;

export async function sendBookingConfirmation(b: Booking) {
  if (!resend) return { skipped: true };
  const body = `
    <p>Dear ${b.fullName},</p>
    <p>Thank you for choosing WeddingFilma. Your booking request has been received. Our creative director will personally reach out within 24 hours.</p>
    <p style="background:#0f0d0c;border:1px solid #3a2f22;border-radius:10px;padding:16px;">
      <strong style="color:#d4a574;">Booking ID:</strong> ${b.bookingCode}<br/>
      <strong>Event:</strong> ${b.eventType.replace("_", " ")}<br/>
      <strong>Date:</strong> ${new Date(b.eventDate).toDateString()}<br/>
      <strong>City:</strong> ${b.city}${b.venue ? `<br/><strong>Venue:</strong> ${b.venue}` : ""}
    </p>
    <p>With warmth,<br/>The WeddingFilma team</p>
  `;
  return resend.emails.send({
    from: FROM,
    to: b.email,
    subject: `Your booking is received — ${b.bookingCode}`,
    html: layout("Your story begins here.", body),
  });
}

export async function sendAdminNotification(b: Booking) {
  if (!resend) return { skipped: true };
  const body = `
    <p><strong>New booking request</strong></p>
    <p style="background:#0f0d0c;border:1px solid #3a2f22;border-radius:10px;padding:16px;">
      <strong style="color:#d4a574;">${b.bookingCode}</strong><br/>
      ${b.fullName} · ${b.email} · ${b.phone}<br/>
      ${b.eventType.replace("_", " ")} · ${new Date(b.eventDate).toDateString()}<br/>
      ${b.city}${b.venue ? ` · ${b.venue}` : ""}<br/>
      ${b.services?.length ? `<em>Services:</em> ${b.services.join(", ")}<br/>` : ""}
      ${b.notes ? `<em>Notes:</em> ${b.notes}` : ""}
    </p>
  `;
  return resend.emails.send({
    from: FROM,
    to: ADMIN,
    subject: `New booking · ${b.bookingCode} · ${b.fullName}`,
    html: layout("New booking request", body),
  });
}

export async function sendContactAdmin(m: {
  name: string; email: string; phone?: string; subject?: string; message: string;
}) {
  if (!resend) return { skipped: true };
  const body = `
    <p><strong>${m.name}</strong> · ${m.email}${m.phone ? ` · ${m.phone}` : ""}</p>
    ${m.subject ? `<p><em>Subject:</em> ${m.subject}</p>` : ""}
    <p style="background:#0f0d0c;border:1px solid #3a2f22;border-radius:10px;padding:16px;white-space:pre-wrap;">${m.message}</p>
  `;
  return resend.emails.send({
    from: FROM,
    to: ADMIN,
    subject: `New enquiry — ${m.subject || m.name}`,
    html: layout("New enquiry", body),
  });
}
