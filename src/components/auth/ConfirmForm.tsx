'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const schema = yup.object({
  code: yup.string()
    .required('Confirmation code is required')
    .matches(/^[0-9]+$/, 'Code must contain only numbers')
    .min(4, 'Code must be at least 4 digits')
});

// Componente para mostrar mensajes con distintos tipos
const AlertMessage = ({ message, type = "error" }: { message: string; type: 'error' | 'warning' | 'info' | 'success' }) => {
  const icons = {
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <AlertCircle className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />
  };

  const styles = {
    error: "bg-red-50 border-red-200 text-red-600",
    warning: "bg-amber-50 border-amber-200 text-amber-600",
    info: "bg-blue-50 border-blue-200 text-blue-600",
    success: "bg-green-50 border-green-200 text-green-600"
  };

  return (
    <div className={`flex items-center gap-2 border rounded-md p-4 text-sm ${styles[type]}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};

interface ConfirmFormProps {
  email: string | null;
}

export default function ConfirmForm({ email }: ConfirmFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'warning' | 'info' | 'success' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: { code: string }) => {
    if (!email) {
      setMessage({ text: 'Email is missing. Please go back to the registration page.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await authApi.confirmEmail({ email, code: data.code });
      setMessage({ 
        text: 'Email confirmed successfully! Redirecting you to login...', 
        type: 'success' 
      });
      
      // Redirect after a short delay to allow user to see the success message
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error("Confirmation error details:", err);
      
      // Mensaje de error por defecto más amigable
      let errorMessage = {
        text: "Invalid confirmation code. Please check and try again.",
        type: 'error' as 'error' | 'warning' | 'info' | 'success'
      };
      
      // Intentar obtener un mensaje más específico si es posible
      if (err.response) {
        const statusCode = err.response.status;
        const errResponseMessage = err.response.data?.message || "";

        if (errResponseMessage.includes("expired") || errResponseMessage.includes("timeout")) {
          errorMessage = {
            text: "This confirmation code has expired. Please request a new code.",
            type: "warning"
          };
        } else if (errResponseMessage.includes("invalid") || errResponseMessage.includes("incorrect") || statusCode === 400) {
          // Mantener el mensaje por defecto
        } else if (errResponseMessage.includes("already confirmed") || statusCode === 409) {
          errorMessage = {
            text: "This email is already confirmed. Please proceed to login.",
            type: "info"
          };
        }
        // No mostrar nunca errores internos del servidor al usuario
      } else if (err.request && !err.response) {
        errorMessage = {
          text: "Unable to connect to the verification service. Please try again later.",
          type: "warning"
        };
      }
      
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setMessage({ text: 'Email is missing. Please go back to the registration page.', type: 'error' });
      return;
    }

    setIsResending(true);
    setMessage(null);

    try {
      await authApi.resendCode(email);
      setMessage({ 
        text: 'A new confirmation code has been sent to your email.',
        type: 'success' 
      });
    } catch (err: any) {
      console.error("Resend code error details:", err);
      
      // Mensaje de error por defecto más amigable
      let errorMessage = {
        text: "We couldn't send a new code. Please try again later.",
        type: 'warning' as 'error' | 'warning' | 'info' | 'success'
      };
      
      // Intentar obtener un mensaje más específico si es posible
      if (err.response) {
        const statusCode = err.response.status;
        const errResponseMessage = err.response.data?.message || "";

        if (errResponseMessage.includes("already confirmed") || statusCode === 409) {
          errorMessage = {
            text: "This email is already confirmed. Please proceed to login.",
            type: "info"
          };
        } else if (errResponseMessage.includes("too many") || errResponseMessage.includes("limit") || statusCode === 429) {
          errorMessage = {
            text: "Too many code requests. Please wait before requesting a new code.",
            type: "warning"
          };
        } else if (errResponseMessage.includes("not found") || statusCode === 404) {
          errorMessage = {
            text: "Email not found. Please register first.",
            type: "error"
          };
        }
        // No mostrar nunca errores internos del servidor al usuario
      } else if (err.request && !err.response) {
        errorMessage = {
          text: "Unable to connect to the verification service. Please try again later.",
          type: "warning"
        };
      }
      
      setMessage(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && <AlertMessage message={message.text} type={message.type} />}
      
      {email ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-4 text-sm">
          <p>We've sent a confirmation code to: <strong>{email}</strong></p>
          <p className="mt-1">Please check your inbox and enter the code below.</p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-md mb-4 text-sm">
          <p>Email address is missing. Please return to the registration page.</p>
        </div>
      )}
      
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Confirmation Code
        </label>
        <input
          {...register('code')}
          type="text"
          id="code"
          placeholder="Enter confirmation code"
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black
            ${errors.code ? "border-red-300" : "border-gray-300"}`}
        />
        {errors.code && (
          <span className="text-sm text-red-600 mt-1 block">{errors.code.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${isLoading 
            ? "bg-indigo-400 cursor-not-allowed" 
            : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </div>
        ) : "Confirm Email"}
      </button>

      <button
        type="button"
        onClick={handleResendCode}
        disabled={isResending}
        className={`w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium 
          ${isResending 
            ? "text-gray-400 bg-gray-100 cursor-not-allowed" 
            : "text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
      >
        {isResending ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </div>
        ) : "Resend Code"}
      </button>
    </form>
  );
}