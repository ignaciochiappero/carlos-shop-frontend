//front-new\src\components\auth\ConfirmForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation'; // Ya no usamos useSearchParams aquí
import { authApi } from '@/lib/api';
import { useState } from 'react';

const schema = yup.object({
  code: yup.string().required('Confirmation code is required'),
});

interface ConfirmFormProps {
  email: string | null;
}

export default function ConfirmForm({ email }: ConfirmFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: { code: string }) => {
    if (!email) {
      setError('Email is missing');
      return;
    }

    try {
      await authApi.confirmEmail({ email, code: data.code });
      router.push('/login');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Confirmation failed');
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email is missing');
      return;
    }

    try {
      await authApi.resendCode(email);
      setError('New code has been sent to your email');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Confirmation Code
        </label>
        <input
          {...register('code')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
        />
        {errors.code && (
          <span className="text-red-500 text-sm">{errors.code.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Confirm Email
      </button>

      <button
        type="button"
        onClick={handleResendCode}
        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Resend Code
      </button>
    </form>
  );
}