'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Login from '@/components/admin/Login';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');

  return <Login admin={true} redirect={redirect} />;
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<Login admin={true} redirect={null} />}>
      <LoginContent />
    </Suspense>
  );
}

