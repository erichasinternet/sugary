import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Sugary',
  description: 'Terms of service for Sugary - the rules and guidelines for using our service.',
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
            <p className="text-foreground leading-relaxed">
              These Terms of Service ("Terms") govern your use of Sugary (the "Service") operated by Gant Street LLC ("us", "we", or "our"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Description of Service</h2>
            <p className="text-foreground leading-relaxed">
              Sugary is a platform that helps companies capture and nurture interest in specific features. Users can sign up to track interest in features and receive updates when those features are released.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">User Accounts</h2>
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                To access certain features of the Service, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and up-to-date information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptable Use</h2>
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">You agree not to:</p>
              <ul className="list-disc list-inside text-foreground space-y-2">
                <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Upload or transmit malicious code or harmful content</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or harvest personal information from other users</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Content and Data</h2>
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                You retain ownership of any content you provide to the Service. By using the Service, you grant us a license to use, display, and distribute your content as necessary to provide the Service.
              </p>
              <p className="text-foreground leading-relaxed">
                We reserve the right to remove any content that violates these Terms or is otherwise objectionable.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Service Availability</h2>
            <p className="text-foreground leading-relaxed">
              We strive to maintain high availability of our Service, but we do not guarantee uninterrupted access. We may modify, suspend, or discontinue the Service at any time with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
            <p className="text-foreground leading-relaxed">
              The Service and its original content, features, and functionality are owned by Gant Street LLC and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Privacy</h2>
            <p className="text-foreground leading-relaxed">
              Your privacy is important to us. Please review our{' '}
              <Link href="/privacy" className="text-primary hover:text-primary-dark">
                Privacy Policy
              </Link>
              {' '}to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                <strong>Complete Limitation:</strong> To the fullest extent permitted by law, Gant Street LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenues, data, use, goodwill, or other intangible losses, whether incurred directly or indirectly, even if we have been advised of the possibility of such damages.
              </p>
              <p className="text-foreground leading-relaxed">
                <strong>Maximum Liability Cap:</strong> Our total liability to you for all claims arising out of or relating to these Terms or your use of the Service shall not exceed the greater of: (a) the amount you paid us in the twelve (12) months preceding the claim, or (b) $100.
              </p>
              <p className="text-foreground leading-relaxed">
                <strong>Time Limitation:</strong> Any claim against us must be brought within one (1) year after the cause of action arises, or such claim will be permanently barred.
              </p>
              <p className="text-foreground leading-relaxed">
                <strong>Essential Terms:</strong> You acknowledge that these limitations of liability are essential elements of the agreement between us and that we would not provide the Service without these limitations.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer of Warranties</h2>
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                <strong>No Warranties:</strong> The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, title, or non-infringement.
              </p>
              <p className="text-foreground leading-relaxed">
                <strong>Service Availability:</strong> We do not warrant that the Service will be uninterrupted, secure, or error-free, or that any defects will be corrected. We make no warranties about the accuracy, reliability, completeness, or timeliness of any content or data.
              </p>
              <p className="text-foreground leading-relaxed">
                <strong>Third-Party Services:</strong> We disclaim all warranties with respect to any third-party services, integrations, or content accessible through our Service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                <strong>Our Right to Terminate:</strong> We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including but not limited to conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
              <p className="text-foreground leading-relaxed">
                <strong>Effect of Termination:</strong> Upon termination, your right to use the Service will cease immediately. We shall not be liable to you or any third party for any termination of your access to the Service.
              </p>
              <p className="text-foreground leading-relaxed">
                <strong>Survival:</strong> The provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Indemnification</h2>
            <p className="text-foreground leading-relaxed">
              You agree to defend, indemnify, and hold harmless Gant Street LLC, its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law and Disputes</h2>
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                <strong>Governing Law:</strong> These Terms shall be governed and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.
              </p>
              <p className="text-foreground leading-relaxed">
                <strong>Dispute Resolution:</strong> Any dispute arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association. The arbitration shall be conducted in Delaware.
              </p>
              <p className="text-foreground leading-relaxed">
                <strong>Class Action Waiver:</strong> You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
            <p className="text-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:eric@gantstreet.com" className="text-primary hover:text-primary-dark">
                eric@gantstreet.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
            <p className="text-foreground leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}