"use client";
import React, { Suspense } from "react";
import ConfirmForm from "@/components/auth/ConfirmForm";
import { useSearchParams } from "next/navigation";

// Extracted component that uses useSearchParams
function ConfirmContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Confirm your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter the confirmation code sent to your email
        </p>
      </div>
      <ConfirmForm email={email} />
    </>
  );
}

// Main page component with Suspense boundary
export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Suspense fallback={<p className="text-center">Loading...</p>}>
          <ConfirmContent />
        </Suspense>
      </div>
    </div>
  );
}
