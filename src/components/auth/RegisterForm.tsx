//front-new\src\components\auth\RegisterForm.tsx


"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const schema = yup.object({
  userName: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscore"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
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

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<{ message: string; type: 'error' | 'warning' | 'info' | 'success' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: {
    email: string;
    userName: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Pass data as a single object, not as separate parameters
      await authApi.register({
        email: data.email,
        userName: data.userName,
        password: data.password,
      });
      
      setError({
        message: "Registration successful! Please check your email to verify your account.",
        type: "success"
      });
      
      // Redirect after a short delay to allow user to see the success message
      setTimeout(() => {
        router.push(`/confirm?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (err: any) {
      console.error("Registration error details:", err);
      
      if (err.response) {
        const statusCode = err.response.status;
        const errorMessage = err.response?.data?.message || "";
        
        if (errorMessage.includes("already exists") || statusCode === 409) {
          if (errorMessage.includes("email")) {
            setError({
              message: "This email is already registered. Please use a different email or try to log in.",
              type: "warning"
            });
          } else if (errorMessage.includes("userName") || errorMessage.includes("username")) {
            setError({
              message: "This username is already taken. Please choose a different username.",
              type: "warning"
            });
          } else {
            setError({
              message: "An account with these details already exists. Please try logging in instead.",
              type: "warning"
            });
          }
        } else if (statusCode === 400) {
          if (errorMessage.includes("password")) {
            setError({
              message: "Your password doesn't meet our security requirements. Please choose a stronger password.",
              type: "error"
            });
          } else if (errorMessage.includes("email")) {
            setError({
              message: "The email address you provided is invalid. Please check and try again.",
              type: "error"
            });
          } else {
            setError({
              message: "Please check your information and try again.",
              type: "error"
            });
          }
        } else {
          setError({
            message: errorMessage || "Registration failed. Please try again later.",
            type: "error"
          });
        }
      } else if (err.request && !err.response) {
        setError({
          message: "Unable to connect to the server. Please check your internet connection and try again.",
          type: "warning"
        });
      } else {
        setError({
          message: "An unexpected error occurred. Please try again later.",
          type: "error"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-10 rounded-md shadow-md">
      {error && <AlertMessage message={error.message} type={error.type} />}

      <div >
        <label
          htmlFor="userName"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          {...register("userName")}
          id="userName"
          type="text"
          autoComplete="username"
          placeholder="johndoe123"
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black
            ${errors.userName ? "border-red-300" : "border-gray-300"}`}
        />
        {errors.userName && (
          <span className="text-sm text-red-600 mt-1 block">
            {errors.userName.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black
            ${errors.email ? "border-red-300" : "border-gray-300"}`}
        />
        {errors.email && (
          <span className="text-sm text-red-600 mt-1 block">
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black
            ${errors.password ? "border-red-300" : "border-gray-300"}`}
        />
        {errors.password && (
          <span className="text-sm text-red-600 mt-1 block">
            {errors.password.message}
          </span>
        )}
        
        {/* Password strength indicator */}
        <div className="text-xs text-gray-500 mt-1">
          Password must contain at least 8 characters including uppercase, lowercase, number and special character
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black
            ${errors.confirmPassword ? "border-red-300" : "border-gray-300"}`}
        />
        {errors.confirmPassword && (
          <span className="text-sm text-red-600 mt-1 block">
            {errors.confirmPassword.message}
          </span>
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
            Processing...
          </div>
        ) : "Register"}
      </button>
    </form>
  );
}