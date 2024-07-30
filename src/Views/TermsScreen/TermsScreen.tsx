import clsx from 'clsx';
import React from 'react';
import useAppTheme from '../../Hooks/themeHook';

function TermsScreen() {
  const email = 'harjot.singh@chicmic.co.in';
  const [theme] = useAppTheme();
  return (
    <div
      className={clsx(
        'w-full px-3 sm:px-6 py-3',
        theme === 'dark' && 'text-white'
      )}
    >
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Introduction</h2>
          <p>
            By using Montra Expense Tracker, you agree to these terms. Please
            read them carefully.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Use of the App</h2>
          <p>
            Montra Expense Tracker is for personal, non-commercial use to manage
            your finances.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Account Registration</h2>
          <p>
            Provide accurate information when registering and keep it updated.
            You are responsible for your account&apos;s security.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
          <ul className="list-disc list-inside">
            <li>Keep your account information confidential.</li>
            <li>Do not use the app for illegal activities.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Privacy</h2>
          <p>
            Your use of the app is governed by our Privacy Policy. Review it to
            understand how we handle your information.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
          <p>
            All content and features of Montra Expense Tracker are owned by
            Montra and its licensors.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Termination</h2>
          <p>
            We can terminate or suspend your access for any reason, including
            violation of these terms.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Limitation of Liability
          </h2>
          <p>
            The app is provided &quot;as is&quot; without warranties. We do not
            guarantee it will always be available or error-free.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
          <p>We may update these terms. Check them periodically for changes.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p>
            Questions? Contact us at{' '}
            <a href={`mailto:${email}`} className="text-blue-500 underline">
              {email}
            </a>
            .
          </p>
        </section>
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Introduction</h2>
          <p>
            Montra is committed to protecting your privacy. This policy explains
            how we collect, use, and share your information.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <p>
            We collect information you provide when you create an account and
            use the app.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Use of Information</h2>
          <ul className="list-disc list-inside">
            <li>Provide and improve the app</li>
            <li>Communicate with you</li>
            <li>Analyze app usage</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Sharing Information</h2>
          <p>We only share your information:</p>
          <ul className="list-disc list-inside">
            <li>With your consent</li>
            <li>With service providers</li>
            <li>To comply with legal requirements</li>
            <li>To protect our rights</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Data Security</h2>
          <p>We protect your information with appropriate security measures.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Data Retention</h2>
          <p>
            We keep your information as long as needed to provide the app and
            comply with legal obligations.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
          <p>
            You can access, correct, or delete your information. Contact us at{' '}
            <a href={`mailto:${email}`} className="text-blue-500 underline">
              {email}
            </a>{' '}
            to exercise these rights.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Changes to Policy</h2>
          <p>We may update this policy. Check it periodically for changes.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p>
            Questions? Contact us at{' '}
            <a href={`mailto:${email}`} className="text-blue-500 underline">
              {email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

export default React.memo(TermsScreen);
