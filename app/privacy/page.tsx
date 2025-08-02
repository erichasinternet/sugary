import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sugary',
  description: 'Privacy policy for Sugary - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-primary hover:text-primary-dark transition-colors mb-4 inline-block"
          >
            ← Back to Sugary
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
            <p className="text-foreground leading-relaxed">
              Sugary ("we," "our," or "us") is operated by Gant Street LLC. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website sugary.dev and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Personal Information</h3>
                <p className="text-foreground leading-relaxed">
                  We may collect personal information that you voluntarily provide, including:
                </p>
                <ul className="list-disc list-inside text-foreground mt-2 space-y-1">
                  <li>Email addresses when you sign up for feature updates</li>
                  <li>Company information for dashboard accounts</li>
                  <li>Contact information when you reach out to us</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Usage Information</h3>
                <p className="text-foreground leading-relaxed">
                  We automatically collect information about how you use our service, including:
                </p>
                <ul className="list-disc list-inside text-foreground mt-2 space-y-1">
                  <li>Feature interest tracking and engagement metrics</li>
                  <li>Website usage analytics</li>
                  <li>Device and browser information</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-foreground leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-foreground space-y-2">
              <li>Provide and maintain our feature tracking service</li>
              <li>Send you updates about features you've expressed interest in</li>
              <li>Improve our service and user experience</li>
              <li>Communicate with you about your account</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
            <p className="text-foreground leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-foreground space-y-2">
              <li>With your consent</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
            <p className="text-foreground leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="text-foreground leading-relaxed">
              <strong>Limitation of Liability:</strong> While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security and shall not be liable for any unauthorized access to or use of your information beyond our reasonable control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
            <p className="text-foreground leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-foreground space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Unsubscribe from communications</li>
              <li>Port your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:eric@gantstreet.com" className="text-primary hover:text-primary-dark">
                eric@gantstreet.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer and Limitation of Liability</h2>
            <p className="text-foreground leading-relaxed mb-4">
              <strong>Service Provided "As Is":</strong> Our privacy practices and data protection measures are provided "as is" without warranties of any kind. To the fullest extent permitted by law, Gant Street LLC disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.
            </p>
            <p className="text-foreground leading-relaxed mb-4">
              <strong>Limitation of Liability:</strong> In no event shall Gant Street LLC be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses resulting from your use of our service or any privacy-related issues, even if we have been advised of the possibility of such damages.
            </p>
            <p className="text-foreground leading-relaxed">
              <strong>Maximum Liability:</strong> Our total liability to you for all claims arising out of or relating to this Privacy Policy or our data practices shall not exceed the amount you paid us in the twelve (12) months preceding the claim, or $100, whichever is less.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}