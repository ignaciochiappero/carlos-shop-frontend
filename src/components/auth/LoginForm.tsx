
//front-new\src\components\auth\LoginForm.tsx


"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { LoginCredentials } from "@/types/user";
import { useNavbar } from "@/context/NavbarContext";
import { AlertCircle, AlertTriangle, XCircle } from "lucide-react";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

// Componente para mostrar mensajes de error con diferentes severidades
const ErrorMessage = ({ message, type = "error" }: { message: string; type?: "error" | "warning" | "info" }) => {
  const icons = {
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <AlertCircle className="h-5 w-5 text-blue-500" />,
  };

  const styles = {
    error: "bg-red-50 border-red-200 text-red-600",
    warning: "bg-amber-50 border-amber-200 text-amber-600",
    info: "bg-blue-50 border-blue-200 text-blue-600",
  };

  return (
    <div className={`flex items-center gap-2 border rounded-md p-4 text-sm ${styles[type]}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};

// Extract component that uses useSearchParams
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'error' | 'warning' | 'info' } | null>(null);
  const { setUser, setAccessToken } = useAuthStore();
  const { refreshNavbar } = useNavbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.login(data);

      // Store the token and user data
      setAccessToken(response.access_token);
      setUser(response.user);

      // Store token in localStorage
      localStorage.setItem("access_token", response.access_token);

      // Actualizar la navbar
      refreshNavbar();

      // Get the redirect URL from query parameters or default to dashboard
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    } catch (err: any) {
      console.error("Login error details:", err);
      
      // Manejar diferentes tipos de errores basados en el código de error o mensaje
      if (err.response) {
        const statusCode = err.response.status;
        const errorMessage = err.response.data?.message || "";

        if (statusCode === 401) {
          setError({
            message: "Incorrect email or password. Please check your credentials and try again.",
            type: "error"
          });
        } else if (statusCode === 403) {
          setError({
            message: "Your account is not verified. Please check your email and verify your account.",
            type: "warning"
          });
        } else if (errorMessage.includes("not found") || errorMessage.includes("no exist")) {
          setError({
            message: "We couldn't find an account with that email. Please check your email or register for a new account.",
            type: "warning"
          });
        } else if (errorMessage.includes("disabled") || errorMessage.includes("blocked")) {
          setError({
            message: "Your account has been temporarily disabled. Please contact support for assistance.",
            type: "error"
          });
        } else if (statusCode === 429) {
          setError({
            message: "Too many login attempts. Please wait a few minutes before trying again.",
            type: "warning"
          });
        } else {
          setError({
            message: err.response.data?.message || "An error occurred during login. Please try again later.",
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
          message: "An unexpected error occurred. Please try again later or contact support if the problem persists.",
          type: "error"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-w-[320px] w-full max-w-md space-y-8">
      {error && <ErrorMessage message={error.message} type={error.type} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black
                ${errors.email ? "border-red-300" : "border-gray-300"}`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              {...register("password")}
              id="password"
              type="password"
              autoComplete="current-password"
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm text-black
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                ${errors.password ? "border-red-300" : "border-gray-300"}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${
                isLoading
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
                Signing in...
              </div>
            ) : "Sign in"}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="w-full text-center py-4">Loading login form...</div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}