import Layout from '@/components/Layout';
import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <Layout>
      <main
        id="content"
        className="bypass-block-target main-content pt-16 pb-8"
        tabIndex="-1"
      >
        <div className="container text-center">
          <h1 className="font-xxl">404</h1>
          <h2 className="font-lg mb-4">Page Not Found</h2>
          <p className="mb-4">
            The page you are looking for could not be found.
          </p>
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </main>
    </Layout>
  );
}

