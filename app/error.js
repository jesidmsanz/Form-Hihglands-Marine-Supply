'use client';

import Layout from '@/components/Layout';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Layout>
      <main
        id="content"
        className="bypass-block-target main-content pt-16 pb-8"
        tabIndex="-1"
      >
        <div className="container text-center">
          <h1 className="font-xxl">Error</h1>
          <p>We&apos;re sorry. You have experienced a site error.</p>
          <p className="mb-4">
            An error occurred. Please try again or contact support if the problem persists.
          </p>
          <button
            onClick={reset}
            className="btn btn-primary"
          >
            Try again
          </button>
          <p className="mt-4">
            Please try again! If you receive this message a second time, please report this problem
            to <a href="mailto:help@it49.com" className="text-green">help@it49.com</a>.
          </p>
        </div>
      </main>
    </Layout>
  );
}

