import Layout from '@/components/Layout';
import { formatPhoneText } from '@/utils/utilities/stringUtils';

export const metadata = {
  title: `Privacy Policy - ${process.env.NEXT_PUBLIC_NAME_COMPANY}`,
  description: `Privacy Policy of ${process.env.NEXT_PUBLIC_NAME_COMPANY}. Learn how we collect, use, and protect your personal information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <main
        id="content"
        className="bypass-block-target main-content content-alice"
        tabIndex="-1"
      >
        <div className="container">
          <h1 className="font-xl">Privacy Policy</h1>

          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
            <p>
              This Privacy Policy explains how <strong>{process.env.NEXT_PUBLIC_NAME_COMPANY}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;)
              collects, uses, and protects your personal information when you visit our website or use our services.
              By accessing our website, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li>Personal identification details (name, email address, phone number)</li>
              <li>Appointment or inquiry details submitted via our forms</li>
              <li>Technical data such as IP address, browser type, and device information</li>
              <li>Cookies and usage data for analytics and performance improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Provide, operate, and improve our services</li>
              <li>Respond to your questions or appointment requests</li>
              <li>Send relevant updates or communications (with your consent)</li>
              <li>Comply with legal obligations and ensure website security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Data Protection</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data from unauthorized access,
              alteration, disclosure, or destruction. However, please note that no internet transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Sharing of Information</h2>
            <p>
              We do not sell or rent your personal data. We may share information only with trusted service providers
              who assist in operating our business (such as hosting, analytics, or communications), under strict confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience and analyze site traffic. You can manage or disable
              cookies through your browser settings, but some features of the site may not function properly as a result.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Your Rights</h2>
            <p>
              You have the right to access, correct, or request deletion of your personal information.
              If you wish to exercise any of these rights, please contact us at{' '}
              <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_COMPANY}`} className="break-email">{process.env.NEXT_PUBLIC_EMAIL_COMPANY}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
              Continued use of our website after updates constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p>
                Phone us on <a href={`tel:+1${process.env.NEXT_PUBLIC_PHONE_COMPANY}`}>{formatPhoneText(process.env.NEXT_PUBLIC_PHONE_COMPANY)}</a>
            </p>
            <address className='mb-8'>Visit us at <a href={process.env.NEXT_PUBLIC_GOOGLE_MAPS} target="_blank" rel="noreferrer noopener" aria-label='Opens in new tab'>{process.env.NEXT_PUBLIC_ADDRESS_COMPANY}, {process.env.NEXT_PUBLIC_CITY_COMPANY}, {process.env.NEXT_PUBLIC_STATE_COMPANY} {process.env.NEXT_PUBLIC_ZIP_CODE_COMPANY}</a></address>
            <p>Email us at <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_COMPANY}`} className="break-email">{process.env.NEXT_PUBLIC_EMAIL_COMPANY}</a></p>
          </section>
        </div>
      </main>
    </Layout>
  );
}

