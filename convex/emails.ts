import { Resend } from '@convex-dev/resend';
import { v } from 'convex/values';
import { components } from './_generated/api';
import { internalAction } from './_generated/server';

const resend = new Resend(components.resend, {
  testMode: false,
});

export const sendConfirmationEmail = internalAction({
  args: {
    email: v.string(),
    featureTitle: v.string(),
    companyName: v.string(),
    confirmationToken: v.string(),
  },
  handler: async (ctx, { email, featureTitle, companyName, confirmationToken }) => {
    const confirmationUrl = `${process.env.SITE_URL}/confirm/${confirmationToken}`;

    await resend.sendEmail(ctx, {
      from: 'Sugary <noreply@sugary.dev>',
      to: email,
      subject: `🎉 You're almost in! Confirm your interest in ${featureTitle}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <div style="background: rgba(255,255,255,0.1); display: inline-block; padding: 12px; border-radius: 50%; margin-bottom: 16px;">
              <div style="width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">🎯</div>
            </div>
            <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px;">Almost there!</h1>
            <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin: 0; font-weight: 400;">Just one click to stay updated on <strong>${featureTitle}</strong></p>
          </div>
          
          <div style="padding: 40px 32px;">
            <p style="color: #374151; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0; font-weight: 500;">Hey there! 👋</p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
              Thanks for showing interest in <strong style="color: #1f2937; font-weight: 600;">${featureTitle}</strong> from ${companyName}! 
              We're excited to have you on this journey with us.
            </p>
            
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #0ea5e9; padding: 24px; border-radius: 12px; margin: 32px 0;">
              <p style="color: #0c4a6e; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; font-weight: 500;">
                ✨ <strong>What you'll get:</strong>
              </p>
              <ul style="color: #0c4a6e; font-size: 15px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Early access when it's ready</li>
                <li style="margin-bottom: 8px;">Progress updates as we build</li>
                <li>Direct input on the feature development</li>
              </ul>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
              Ready to confirm? Just click the shiny button below! 👇
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 18px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; border: 3px solid transparent;">
                🚀 Yes, Keep Me Updated!
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 32px 0 0 0; line-height: 1.5;">
              <em>This button expires in 7 days, so don't wait too long! ⏰</em>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f9fafb; padding: 24px 32px; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 0; line-height: 1.5;">
              Sent with ❤️ by <strong>Sugary</strong> on behalf of <strong>${companyName}</strong><br>
              <span style="color: #d1d5db;">Didn't sign up? No worries, you can safely ignore this email.</span>
            </p>
          </div>
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
    { emails, featureTitle, companyName, updateTitle, updateContent, unsubscribeUrl },
  ) => {
    // Send individual emails to avoid issues with bulk sending
    const emailPromises = emails.map((email) =>
      resend.sendEmail(ctx, {
        from: 'Sugary <noreply@sugary.dev>',
        to: email,
        subject: `🚀 Exciting news about ${featureTitle}!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <!-- Header with celebration gradient -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
              <div style="background: rgba(255,255,255,0.15); display: inline-block; padding: 12px; border-radius: 50%; margin-bottom: 16px;">
                <div style="width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">🎉</div>
              </div>
              <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px;">${updateTitle}</h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin: 0; font-weight: 400;">Fresh progress on <strong>${featureTitle}</strong></p>
            </div>
            
            <div style="padding: 40px 32px;">
              <p style="color: #374151; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0; font-weight: 500;">Hey there! 👋</p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.7; margin: 0 0 32px 0;">
                We've got some exciting updates to share about <strong style="color: #1f2937; font-weight: 600;">${featureTitle}</strong>! 
                Your patience and support mean everything to us. 🙏
              </p>
              
              <!-- Update content -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #10b981; padding: 32px; border-radius: 16px; margin: 32px 0; position: relative;">
                <div style="position: absolute; top: -12px; left: 24px; background: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Latest Update</div>
                <div style="color: #14532d; font-size: 16px; line-height: 1.7; margin-top: 8px;">
                  ${updateContent
                    .split('\n')
                    .filter(line => line.trim())
                    .map((line, index) => `<p style="margin: ${index === 0 ? '0' : '16px'} 0 0 0;">${line}</p>`)
                    .join('')}
                </div>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <p style="color: #4b5563; font-size: 16px; margin: 0 0 16px 0;">
                  <strong>Love what you're seeing?</strong> Share the excitement! 
                </p>
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Your feedback and enthusiasm fuel our motivation 💪
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 24px 32px; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 0 0 8px 0; line-height: 1.5;">
                Sent with ❤️ by <strong>Sugary</strong> on behalf of <strong>${companyName}</strong>
              </p>
              ${unsubscribeUrl ? `<p style="color: #d1d5db; font-size: 12px; text-align: center; margin: 0;"><a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: none;">Unsubscribe</a> • <span style="color: #e5e7eb;">|</span> • We respect your inbox</p>` : ''}
            </div>
          </div>
        `,
      }),
    );

    await Promise.all(emailPromises);

    return { sent: emails.length };
  },
});
