import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

// Sender email
const FROM =
  process.env.EMAIL_FROM ??
  "WeddingFilma <bookings@weddingfilma.in>";

// Admin notification email
const ADMIN =
  process.env.ADMIN_EMAIL ??
  "yourgmail@gmail.com";

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
<html>
<body style="font-family:Georgia,serif;background:#0f0d0c;padding:40px;color:#efe7d9;">
  <div style="max-width:560px;margin:0 auto;background:#1a1614;border-radius:16px;padding:40px;border:1px solid #3a2f22;">
    <p style="font-family:Georgia,serif;letter-spacing:.3em;font-size:12px;color:#d4a574;margin:0 0 8px;text-transform:uppercase;">
      WeddingFilma
    </p>

    <h1 style="font-weight:400;font-size:28px;margin:0 0 16px;color:#efe7d9;">
      ${title}
    </h1>

    ${body}

    <hr style="border:none;border-top:1px solid #3a2f22;margin:32px 0;" />

    <p style="font-size:12px;color:#8a7f70;">
      WeddingFilma.in · Premium Cinematic Wedding Films & Photography
    </p>
  </div>
</body>
</html>
`;

export async function sendBookingConfirmation(b: Booking) {
  if (!resend) return { skipped: true };

  const body = `
    <p>Dear ${b.fullName},</p>

    <p>
      Thank you for choosing <strong>WeddingFilma</strong>.
      Your booking request has been successfully received.
      Our creative director will contact you within 24 hours.
    </p>

    <div style="background:#0f0d0c;border:1px solid #3a2f22;border-radius:10px;padding:16px;">
      <p><strong style="color:#d4a574;">Booking ID:</strong> ${b.bookingCode}</p>
      <p><strong>Event:</strong> ${b.eventType.replaceAll("_", " ")}</p>
      <p><strong>Date:</strong> ${new Date(b.eventDate).toDateString()}</p>
      <p><strong>City:</strong> ${b.city}</p>
      ${b.venue ? `<p><strong>Venue:</strong> ${b.venue}</p>` : ""}
    </div>

    <p>
      Regards,<br>
      <strong>WeddingFilma Team</strong>
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    to: b.email,
    subject: `Booking Confirmation • ${b.bookingCode}`,
    html: layout("Your story begins here.", body),
  });
}

export async function sendAdminNotification(b: Booking) {
  if (!resend) return { skipped: true };

  const body = `
    <h2>New Booking Received</h2>

    <div style="background:#0f0d0c;border:1px solid #3a2f22;border-radius:10px;padding:16px;">

      <p><strong style="color:#d4a574;">Booking ID:</strong> ${b.bookingCode}</p>

      <p><strong>Name:</strong> ${b.fullName}</p>

      <p><strong>Email:</strong> ${b.email}</p>

      <p><strong>Phone:</strong> ${b.phone}</p>

      <p><strong>Event:</strong> ${b.eventType.replaceAll("_", " ")}</p>

      <p><strong>Date:</strong> ${new Date(b.eventDate).toDateString()}</p>

      <p><strong>City:</strong> ${b.city}</p>

      ${b.venue ? `<p><strong>Venue:</strong> ${b.venue}</p>` : ""}

      ${
        b.services?.length
          ? `<p><strong>Services:</strong> ${b.services.join(", ")}</p>`
          : ""
      }

      ${
        b.notes
          ? `<p><strong>Notes:</strong><br>${b.notes}</p>`
          : ""
      }

    </div>
  `;

  return resend.emails.send({
    from: FROM,
    to: ADMIN,
    subject: `New Booking • ${b.bookingCode}`,
    html: layout("New Booking Received", body),
  });
}

export async function sendContactAdmin(m: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  if (!resend) return { skipped: true };

  const body = `
    <p><strong>Name:</strong> ${m.name}</p>

    <p><strong>Email:</strong> ${m.email}</p>

    ${m.phone ? `<p><strong>Phone:</strong> ${m.phone}</p>` : ""}

    ${m.subject ? `<p><strong>Subject:</strong> ${m.subject}</p>` : ""}

    <div style="background:#0f0d0c;border:1px solid #3a2f22;border-radius:10px;padding:16px;white-space:pre-wrap;">
      ${m.message}
    </div>
  `;

  return resend.emails.send({
    from: FROM,
    to: ADMIN,
    subject: `Website Enquiry • ${m.subject || m.name}`,
    html: layout("New Website Enquiry", body),
  });
}
