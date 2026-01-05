/**
 * Notification System
 * 
 * Handles sending notifications and storing them in the database.
 * Uses Resend (recommended) or Gmail SMTP (fallback) for email delivery.
 */

import { prisma } from "@/lib/prisma"
import * as nodemailer from "nodemailer"
import { Resend } from "resend"

export type NotificationType =
  | "REQUEST_SUBMITTED"
  | "REQUEST_APPROVED"
  | "REQUEST_REJECTED"
  | "REQUEST_MODIFIED"
  | "REQUEST_CANCELLED"
  | "OVERRIDE_CREATED"

export interface NotificationData {
  userId: string
  type: NotificationType
  title: string
  message: string
  metadata?: Record<string, any>
}

/**
 * Initialize Resend client
 * Resend is recommended for Railway/production environments
 */
function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return null
  }

  return new Resend(apiKey)
}

/**
 * Create Gmail transporter (fallback)
 * Uses Gmail SMTP to send emails
 */
function createTransporter() {
  const email = process.env.GMAIL_EMAIL
  const password = process.env.GMAIL_APP_PASSWORD

  if (!email || !password) {
    return null
  }

  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465, // Use port 465 with SSL (more reliable than 587)
    secure: true, // true for 465, false for other ports
    auth: {
      user: email,
      pass: password, // Gmail App Password (not regular password)
    },
    connectionTimeout: 10000, // 10 second timeout (increased from 5)
    greetingTimeout: 10000,   // 10 second timeout
    socketTimeout: 10000,     // 10 second timeout
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false,
    },
  })
}

/**
 * Send email notification
 * 
 * Priority:
 * 1. Resend (recommended for Railway/production)
 * 2. Gmail SMTP (fallback)
 * 3. Console logging (if neither is configured)
 */
export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<void> {
  const resend = createResendClient()
  const transporter = createTransporter()
  // For Resend: use verified domain or default testing email
  // IMPORTANT: Don't use Gmail addresses with Resend - they need to be verified domains
  let resendFromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"
  // If RESEND_FROM_EMAIL is set to a Gmail address, use default instead
  if (resendFromEmail.includes("@gmail.com") || resendFromEmail.includes("@googlemail.com")) {
    console.warn("⚠️ RESEND_FROM_EMAIL cannot be a Gmail address. Using default onboarding@resend.dev")
    resendFromEmail = "onboarding@resend.dev"
  }
  // For Gmail SMTP: use Gmail email
  const gmailFromEmail = process.env.GMAIL_EMAIL || "noreply@example.com"

  // Try Resend first (recommended for Railway)
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: `Room Booking System <${resendFromEmail}>`,
        to: [to],
        subject,
        text: body,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${body.replace(/\n/g, "<br>")}</p>
        </div>`,
      })

      if (error) {
        throw new Error(`Resend error: ${error.message}`)
      }

      console.log(`✅ Email sent successfully via Resend to ${to}`)
      return
    } catch (error: any) {
      console.error("❌ Resend failed, trying Gmail SMTP fallback:", error)
      // Fall through to Gmail SMTP
    }
  }

  // Fallback to Gmail SMTP
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Room Booking System" <${gmailFromEmail}>`,
        to,
        subject,
        text: body,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${body.replace(/\n/g, "<br>")}</p>
        </div>`,
      })

      console.log(`✅ Email sent successfully via Gmail SMTP to ${to}`)
      return
    } catch (error: any) {
      console.error("❌ Gmail SMTP failed:", error)
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          code: (error as any).code,
          command: (error as any).command,
        })
      }
      // Fall through to console logging
    }
  }

  // Final fallback: console logging
  console.warn("⚠️ No email service configured. Emails will only be logged to console.")
  console.log("📧 Email Notification (console only):", {
    to,
    subject,
    body,
    timestamp: new Date().toISOString(),
  })
  
  // Don't throw error - allow the request to succeed even if email fails
  // The verification code is already stored in Redis/memory
}

/**
 * Create and send a notification
 * 
 * Stores notification in database and sends email (stub).
 */
export async function createNotification(
  data: NotificationData
): Promise<void> {
  try {
    // Store notification in database
    await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    })

    // Get user email for sending
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { email: true, name: true },
    })

    if (user) {
      // Send email (stub - logs to console)
      await sendEmail(user.email, data.title, data.message)
    }
  } catch (error) {
    console.error("Failed to create notification:", error)
    // Don't throw - notification failure shouldn't break the main flow
  }
}

/**
 * Send booking request submitted notification
 */
export async function notifyRequestSubmitted(
  userId: string,
  requestId: string,
  roomName: string,
  startAt: Date,
  endAt: Date
): Promise<void> {
  await createNotification({
    userId,
    type: "REQUEST_SUBMITTED",
    title: `Booking Request Submitted: ${roomName}`,
    message: `Your booking request for ${roomName} has been submitted and is pending approval. Time: ${startAt.toLocaleString()} - ${endAt.toLocaleTimeString()}`,
    metadata: {
      requestId,
      roomName,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    },
  })
}

/**
 * Send booking approval notification
 */
export async function notifyBookingApproved(
  userId: string,
  requestId: string,
  roomName: string,
  startAt: Date,
  endAt: Date
): Promise<void> {
  await createNotification({
    userId,
    type: "REQUEST_APPROVED",
    title: `Booking Approved: ${roomName}`,
    message: `Your booking request for ${roomName} has been approved. Time: ${startAt.toLocaleString()} - ${endAt.toLocaleTimeString()}`,
    metadata: {
      requestId,
      roomName,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    },
  })
}

/**
 * Send booking rejection notification
 */
export async function notifyBookingRejected(
  userId: string,
  requestId: string,
  roomName: string,
  reason: string
): Promise<void> {
  await createNotification({
    userId,
    type: "REQUEST_REJECTED",
    title: `Booking Request Rejected: ${roomName}`,
    message: `Your booking request for ${roomName} has been rejected. Reason: ${reason}`,
    metadata: {
      requestId,
      roomName,
      reason,
    },
  })
}

/**
 * Send booking modified notification
 */
export async function notifyBookingModified(
  userId: string,
  requestId: string,
  roomName: string,
  reason: string,
  oldStartAt: Date,
  oldEndAt: Date,
  newStartAt: Date,
  newEndAt: Date
): Promise<void> {
  await createNotification({
    userId,
    type: "REQUEST_MODIFIED",
    title: `Booking Modified: ${roomName}`,
    message: `Your booking request for ${roomName} has been modified. Original time: ${oldStartAt.toLocaleString()} - ${oldEndAt.toLocaleTimeString()}. New time: ${newStartAt.toLocaleString()} - ${newEndAt.toLocaleTimeString()}. Reason: ${reason}`,
    metadata: {
      requestId,
      roomName,
      reason,
      oldStartAt: oldStartAt.toISOString(),
      oldEndAt: oldEndAt.toISOString(),
      newStartAt: newStartAt.toISOString(),
      newEndAt: newEndAt.toISOString(),
    },
  })
}

/**
 * Send override booking created notification
 */
export async function notifyOverrideCreated(
  userId: string,
  bookingId: string,
  roomName: string,
  startAt: Date,
  endAt: Date,
  reason: string
): Promise<void> {
  await createNotification({
    userId,
    type: "OVERRIDE_CREATED",
    title: `Override Booking Created: ${roomName}`,
    message: `An override booking has been created for ${roomName} on your behalf. Time: ${startAt.toLocaleString()} - ${endAt.toLocaleTimeString()}. Reason: ${reason}`,
    metadata: {
      bookingId,
      roomName,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      reason,
    },
  })
}
