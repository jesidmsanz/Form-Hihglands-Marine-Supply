'use client';

import { useSearchParams } from 'next/navigation';
import Login from '@/components/admin/Login';

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');

  return <Login admin={true} redirect={redirect} />;
}

