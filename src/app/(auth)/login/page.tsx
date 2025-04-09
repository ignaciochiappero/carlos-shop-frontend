//front-new\src\app\(auth)\login\page.tsx

import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign In | The Carlos Store",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="relative w-32 h-32 mb-4 transition-transform hover:scale-105 duration-300">
              <Image
                src="/carlos-transparent.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w-md mx-auto">
            Welcome back! Please sign in to continue shopping at The Carlos
            Store.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 transition-all duration-300 hover:shadow-xl">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <a
            href="/terms"
            className="underline hover:text-indigo-600 transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline hover:text-indigo-600 transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
