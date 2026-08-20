import { prisma } from "./prisma";

/**
 * Lightweight notification service.
 *
 * Uses plain REST calls (fetch) instead of provider SDKs so no new
 * dependencies are required. Configure via env vars:
 *
 *   RESEND_API_KEY, EMAIL_FROM              -> email delivery (https://resend.com)
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
 *   TWILIO_FROM_NUMBER                      -> SMS delivery (https://twilio.com)
 *
 * If the relevant env vars are not set, sends are logged to the console
 * instead of failing — this keeps local/dev environments working without
 * any provider configured, and keeps callers from having to special-case
 * missing config.
 *
 * Every public function swallows its own errors: a notification failure
 * should never break the request that triggered it (booking a
 * consultation, updating an ambulance request, etc.).
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "CuraLink <notifications@curalink.app>";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!to) return;

  if (!RESEND_API_KEY) {
    console.log(`[notifications] (email provider not configured) would send to ${to}: ${subject}`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
    });

    if (!res.ok) {
      console.error("[notifications] email send failed:", await res.text());
    }
  } catch (err) {
    console.error("[notifications] email send error:", err);
  }
}

export async function sendSms(to: string, body: string): Promise<void> {
  if (!to) return;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.log(`[notifications] (sms provider not configured) would text ${to}: ${body}`);
    return;
  }

  try {
    const params = new URLSearchParams({ From: TWILIO_FROM_NUMBER, To: to, Body: body });
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      }
    );

    if (!res.ok) {
      console.error("[notifications] sms send failed:", await res.text());
    }
  } catch (err) {
    console.error("[notifications] sms send error:", err);
  }
}

export function wrapEmail(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1c1917;">
      <h2 style="color: #134e4a;">${title}</h2>
      ${bodyHtml}
      <p style="margin-top: 24px; font-size: 12px; color: #78716c;">
        You're receiving this because of your notification preferences on CuraLink.
        You can turn these off anytime from your profile's Account Settings.
      </p>
    </div>
  `;
}

/**
 * Notify an account by id, honoring their stored email/SMS preferences
 * and skipping deactivated accounts entirely. Safe to call fire-and-forget
 * (`void notifyAccount(...)`) from any route.
 */
export async function notifyAccount(
  accountId: string,
  notification: {
    subject: string;
    emailBodyHtml: string;
    smsBody?: string;
  }
): Promise<void> {
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        email: true,
        phone: true,
        isActive: true,
        emailNotifications: true,
        smsNotifications: true,
      },
    });

    if (!account || !account.isActive) return;

    const tasks: Promise<void>[] = [];

    if (account.emailNotifications && account.email) {
      tasks.push(sendEmail(account.email, notification.subject, wrapEmail(notification.subject, notification.emailBodyHtml)));
    }

    if (account.smsNotifications && account.phone && notification.smsBody) {
      tasks.push(sendSms(account.phone, notification.smsBody));
    }

    await Promise.all(tasks);
  } catch (err) {
    console.error("[notifications] notifyAccount error:", err);
  }
}

// ---------------------------------------------------------------------------
// Templates for the events CuraLink currently triggers notifications for.
// Keeping these here (rather than inline at each call site) makes the
// wording easy to find and adjust in one place.
// ---------------------------------------------------------------------------

export const notificationTemplates = {
  consultationBooked(doctorName: string, dateStr: string) {
    return {
      subject: "Your consultation is confirmed",
      emailBodyHtml: `<p>Your consultation with <strong>Dr. ${doctorName}</strong> is confirmed for <strong>${dateStr}</strong>.</p>`,
      smsBody: `CuraLink: Your consultation with Dr. ${doctorName} is confirmed for ${dateStr}.`,
    };
  },
  newConsultationForDoctor(patientName: string, dateStr: string) {
    return {
      subject: "New consultation booked",
      emailBodyHtml: `<p>A new consultation with <strong>${patientName}</strong> has been booked for <strong>${dateStr}</strong>.</p>`,
    };
  },
  consultationCompleted(doctorName: string) {
    return {
      subject: "Your consultation has ended",
      emailBodyHtml: `<p>Your consultation with <strong>Dr. ${doctorName}</strong> has ended. Any prescription written will appear in your dashboard.</p>`,
      smsBody: `CuraLink: Your consultation with Dr. ${doctorName} has ended.`,
    };
  },
  prescriptionReady(doctorName: string) {
    return {
      subject: "A prescription is ready for you",
      emailBodyHtml: `<p><strong>Dr. ${doctorName}</strong> has issued a prescription for you. You can view it from your consultations page.</p>`,
      smsBody: `CuraLink: Dr. ${doctorName} has issued a prescription for you.`,
    };
  },
  ambulanceRequestReceived() {
    return {
      subject: "Ambulance request received",
      emailBodyHtml: `<p>We've received your ambulance request and are notifying nearby providers. You'll be notified as soon as one accepts.</p>`,
    };
  },
  ambulanceStatusUpdate(status: string) {
    const statusText: Record<string, string> = {
      ACCEPTED: "A provider has accepted your request and is on the way.",
      DISPATCHED: "Your ambulance has been dispatched.",
      ARRIVED: "Your ambulance has arrived.",
      COMPLETED: "Your ambulance request has been completed.",
      CANCELED: "Your ambulance request was canceled.",
    };
    const text = statusText[status] || `Your ambulance request status changed to ${status}.`;
    return {
      subject: "Ambulance request update",
      emailBodyHtml: `<p>${text}</p>`,
      smsBody: `CuraLink: ${text}`,
    };
  },
  passwordChanged() {
    return {
      subject: "Your password was changed",
      emailBodyHtml: `<p>Your CuraLink password was just changed. If this wasn't you, please contact support immediately.</p>`,
    };
  },
  accountDeactivated() {
    return {
      subject: "Your account has been deactivated",
      emailBodyHtml: `<p>Your CuraLink account has been deactivated as requested. If this wasn't you, please contact support.</p>`,
    };
  },
  consultationCanceled(otherPartyName: string, dateStr: string, canceledByPatient: boolean) {
    const who = canceledByPatient ? "the patient" : "the doctor";
    return {
      subject: "Consultation canceled",
      emailBodyHtml: `<p>Your consultation with <strong>${otherPartyName}</strong> on <strong>${dateStr}</strong> was canceled by ${who}.</p>`,
      smsBody: `CuraLink: Your consultation on ${dateStr} was canceled.`,
    };
  },
  refundIssued(amount: number, currency: string) {
    return {
      subject: "Refund issued",
      emailBodyHtml: `<p>A refund of <strong>${amount.toFixed(2)} ${currency.toUpperCase()}</strong> has been issued to your original payment method. It may take a few business days to appear.</p>`,
      smsBody: `CuraLink: A refund of ${amount.toFixed(2)} ${currency.toUpperCase()} has been issued.`,
    };
  },
  doctorVerified() {
    return {
      subject: "You're now a verified doctor on CuraLink",
      emailBodyHtml: `<p>Your license has been reviewed and your profile now carries the <strong>Verified</strong> badge, visible to patients.</p>`,
    };
  },
  doctorVerificationRejected(note?: string) {
    return {
      subject: "Verification request needs attention",
      emailBodyHtml: `<p>We couldn't verify your license from the information provided.${note ? ` Note from our team: <em>${note}</em>` : ""} Please update your license details and resubmit from your profile.</p>`,
    };
  },
};
