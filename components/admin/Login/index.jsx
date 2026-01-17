'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/actions/auth';

const Login = ({ admin, redirect }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setError('');

    startTransition(async () => {
      try {
        // Usar Server Action moderno - validación automática con Zod
        const result = await loginAction(formData);

        if (!result.success) {
          setError(result.error || 'Invalid credentials. Please check your email and password.');
          return;
        }

        // Si el Server Action fue exitoso, usar Next-Auth para crear la sesión
        const signInResult = await signIn('credentials', {
          redirect: false,
          username: result.user.email,
          password: formData.get('password')?.toString() || '',
        });

        if (signInResult?.ok) {
          const redirectUrl = redirect || '/admin/contacts';
          router.push(redirectUrl);
          router.refresh();
        } else {
          setError('Failed to create session. Please try again.');
        }
      } catch (err) {
        setError('An error occurred during login. Please try again.');
      }
    });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 px-4">
        <form action={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width="180"
                height="150"
                className="object-contain"
              />
            </Link>
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email*
            </label>
            <input
              type="email"
              id="username"
              name="username"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 uppercase tracking-wide shadow-md hover:shadow-lg text-sm"
          >
            {isPending ? 'Loading...' : 'Log In'}
          </button>

          {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default Login;
