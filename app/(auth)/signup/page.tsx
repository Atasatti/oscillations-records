"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

const SignupContent = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (error) {
      console.error("Authentication error:", error);
      setErrorMessage("Authentication failed. Please try again.");
    }
  }, [error]);

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      // Use the direct next-auth signIn with explicit options
      await signIn("google", {
        callbackUrl: "/",
        redirect: true
      });
      
      // Note: The code below won't execute if redirect is true
      // as the page will be redirected by NextAuth
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage("Failed to sign up with Google. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-6">
            <Image
              width={50}
              height={50}
              alt="logo-icon"
              src="/logo-icon.svg"
            />
            <Image
              width={100}
              height={30}
              alt="logo-name"
              src="/logo-name.svg"
            />
          </div>
          <h1 className="text-3xl font-light tracking-tighter opacity-90">
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Sign up to get started
          </p>
        </div>

        <div className="space-y-4">
          {errorMessage && (
            <p className="text-sm text-destructive text-center">{errorMessage}</p>
          )}

          <Button
            type="button"
            className="w-full !py-5 rounded-full text-base"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <FaGoogle className="w-5 h-5 mr-2" />
            {loading ? "Creating Account..." : "Sign up with Google"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const SignupPage = () => {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
};

export default SignupPage;