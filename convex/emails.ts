import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";

const resend = new Resend(components.resend);

export const sendConfirmationEmail = internalAction({
	args: {
		email: v.string(),
		featureTitle: v.string(),
		companyName: v.string(),
		confirmationToken: v.string(),
	},
	handler: async (
		ctx,
		{ email, featureTitle, companyName, confirmationToken },
	) => {
		const confirmationUrl = `${process.env.SITE_URL}/confirm/${confirmationToken}`;

		await resend.sendEmail(ctx, {
			from: "Sugary <noreply@sugary.dev>",
			to: email,
			subject: `Confirm your interest in ${featureTitle}`,
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thanks for your interest in ${featureTitle}!</h2>
          
          <p>Hi there,</p>
          
          <p>You've successfully signed up to be notified about <strong>${featureTitle}</strong> from ${companyName}.</p>
          
          <p>To confirm your subscription and receive updates, please click the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Confirm Subscription
            </a>
          </div>
          
          <p>We'll keep you updated as we make progress on this feature. You can unsubscribe at any time.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            This email was sent by Sugary on behalf of ${companyName}. 
            If you didn't sign up for this, you can safely ignore this email.
          </p>
        </div>
      `,
		});
	},
});

export const sendFeatureUpdateEmail = internalAction({
	args: {
		emails: v.array(v.string()),
		featureTitle: v.string(),
		companyName: v.string(),
		updateTitle: v.string(),
		updateContent: v.string(),
		unsubscribeUrl: v.optional(v.string()),
	},
	handler: async (
		ctx,
		{
			emails,
			featureTitle,
			companyName,
			updateTitle,
			updateContent,
			unsubscribeUrl,
		},
	) => {
		// Send individual emails to avoid issues with bulk sending
		const emailPromises = emails.map((email) =>
			resend.sendEmail(ctx, {
				from: "Sugary <noreply@sugary.dev>",
				to: email,
				subject: `Update: ${updateTitle} - ${featureTitle}`,
				html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${updateTitle}</h2>
            
            <p>Hi there,</p>
            
            <p>We have an update about <strong>${featureTitle}</strong> from ${companyName}:</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
              ${updateContent
								.split("\n")
								.map((line) => `<p>${line}</p>`)
								.join("")}
            </div>
            
            <p>Thanks for your patience as we build this feature!</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="color: #6b7280; font-size: 14px;">
              This email was sent by Sugary on behalf of ${companyName}.
              ${unsubscribeUrl ? `<a href="${unsubscribeUrl}" style="color: #6b7280;">Unsubscribe</a>` : ""}
            </p>
          </div>
        `,
			}),
		);

		await Promise.all(emailPromises);

		return { sent: emails.length };
	},
});
