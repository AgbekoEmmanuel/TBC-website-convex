import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

export const saveSubscription = internalMutation({
  args: {
    email: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already subscribed to prevent duplicates
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter(q => q.eq(q.field("source"), args.source))
      .first();

    if (!existing) {
      await ctx.db.insert("subscriptions", args);
    }
  },
});

export const subscribe = action({
  args: {
    email: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Save to Database
    await ctx.runMutation(internal.subscriptions.saveSubscription, {
      email: args.email,
      source: args.source,
    });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY is missing. Saved subscription, but skipped emails.");
      return { success: true, emailsSent: false };
    }

    const resend = new Resend(apiKey);
    
    // If you don't have a verified domain, Resend forces you to use onboarding@resend.dev
    // AND you can only send emails to the email address you signed up for Resend with!
    const senderEmail = process.env.SENDER_EMAIL || "onboarding@resend.dev";
    
    // This MUST be the email you used to sign up for Resend if you are using the onboarding domain
    const adminEmail = process.env.ADMIN_EMAIL || "info@thebalancechurch24.com";

    try {
      // 2. Alert the Church Admin
      await resend.emails.send({
        from: `Balance Church Alerts <${senderEmail}>`,
        to: adminEmail,
        subject: `New Subscription: ${args.source}`,
        html: `
          <div style="font-family: sans-serif;">
            <h3>New Subscription Received</h3>
            <p><strong>Email:</strong> ${args.email}</p>
            <p><strong>Source:</strong> ${args.source}</p>
          </div>
        `,
      });

      // 3. Auto-reply to the User
      await resend.emails.send({
        from: `The Balance Church <${senderEmail}>`,
        to: args.email,
        subject: "Thank you for subscribing!",
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #112a46;">
            <h2 style="color: #011C40;">Welcome to The Balance Church</h2>
            <p>Hi there,</p>
            <p>Thank you for subscribing to our <strong>${args.source}</strong>! We have successfully received your email.</p>
            <p>A member of our team will reach out to you within the next 24 hours.</p>
            <br/>
            <p>Blessings,<br><strong>The Balance Church Team</strong></p>
          </div>
        `,
      });

      return { success: true, emailsSent: true };
    } catch (error) {
      console.error("Resend Email Error:", error);
      return { success: true, emailsSent: false };
    }
  },
});
