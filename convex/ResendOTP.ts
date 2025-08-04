import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.RESEND_API_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };

    const alphabet = "0123456789";
    const length = 8;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    
    const { error } = await resend.emails.send({
      from: "Sugary <noreply@sugary.dev>",
      to: [email],
      subject: "Verification code for Sugary",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; margin-bottom: 20px;">Verification code for Sugary</h1>
          <p style="color: #666; margin-bottom: 30px;">
            Use the following verification code to continue:
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 8px;">
              ${token}
            </span>
          </div>
          <p style="color: #999; font-size: 14px;">
            This code will expire in 15 minutes. If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
      `,
      text: "Your code is " + token,
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});